import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import busboy from 'busboy';

const memoryStorage = multer.memoryStorage();

export const multerUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});

export const createUploadMiddleware = (expectedField: string = 'image') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rawBody = (req as any).rawBody;

    // When running inside Google Cloud Functions / Cloud Run:
    // The runtime already reads the incoming HTTP stream into req.rawBody!
    if (rawBody && Buffer.isBuffer(rawBody)) {
      try {
        const bb = busboy({ headers: req.headers });
        const fileChunks: Buffer[] = [];
        let detectedField = '';
        let fileInfo: any = null;

        bb.on('file', (name, stream, info) => {
          detectedField = name;
          fileInfo = info;
          stream.on('data', (data) => fileChunks.push(data));
        });

        bb.on('field', (name, val) => {
          if (!req.body) req.body = {};
          req.body[name] = val;
        });

        bb.on('finish', () => {
          if (fileInfo) {
            const fullBuffer = Buffer.concat(fileChunks);
            (req as any).file = {
              fieldname: detectedField || expectedField,
              originalname: fileInfo.filename,
              encoding: fileInfo.encoding,
              mimetype: fileInfo.mimeType,
              buffer: fullBuffer,
              size: fullBuffer.length,
            };
          }
          next();
        });

        bb.on('error', (err) => {
          console.error('Busboy parsing error:', err);
          next(err);
        });

        bb.end(rawBody);
      } catch (err) {
        console.error('Multipart rawBody parse error:', err);
        next(err);
      }
    } else {
      // Normal streaming mode (local dev server)
      multerUpload.single(expectedField)(req, res, next);
    }
  };
};

export const upload = {
  single: (field: string) => createUploadMiddleware(field),
};
