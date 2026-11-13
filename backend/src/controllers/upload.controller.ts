import { Request, Response } from 'express';
import { bucket } from '../config/firebase.js';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({ success: false, message: 'No file uploaded or file buffer empty' });
    }

    const folder = req.body.folder || 'products';
    const timestamp = Date.now();
    const sanitizedFilename = (file.originalname || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const destination = `${folder}/${timestamp}-${sanitizedFilename}`;

    // If Firebase bucket is initialized, upload to Firebase Storage
    if (bucket) {
      const fileUpload = bucket.file(destination);
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise<void>((resolve) => {
        stream.on('error', (error: any) => {
          console.error('Firebase Storage upload error:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to upload image to Firebase Storage',
            error: error.message,
          });
          resolve();
        });

        stream.on('finish', async () => {
          try {
            // Generate standard Firebase Storage token for public browser access
            const token = Date.now().toString(36) + Math.random().toString(36).substring(2);
            await fileUpload.setMetadata({
              contentType: file.mimetype,
              metadata: {
                firebaseStorageDownloadTokens: token,
              },
            });
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`;
            res.json({
              success: true,
              message: 'Image uploaded successfully to Firebase Storage',
              url: publicUrl,
              destination,
            });
            resolve();
          } catch (pubErr: any) {
            console.warn('Metadata token error, using standard download URL:', pubErr.message);
            const fallbackUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;
            res.json({
              success: true,
              message: 'Image uploaded successfully',
              url: fallbackUrl,
              destination,
            });
            resolve();
          }
        });

        stream.end(file.buffer);
      });
    }

    // Fallback if Firebase bucket is not available
    const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return res.json({
      success: true,
      message: 'Notice: Firebase bucket not configured yet. Returned base64 data preview for testing.',
      url: base64Data,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'File upload failed', error: error.message });
  }
};
