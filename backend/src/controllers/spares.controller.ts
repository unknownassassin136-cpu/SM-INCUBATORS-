import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { spares } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllSpares = async (_req: Request, res: Response) => {
  try {
    const allSpares = await db.select().from(spares).orderBy(spares.createdAt);
    return res.json({ success: true, data: allSpares });
  } catch (error: any) {
    console.error('Error fetching spares from database:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch spares', error: error.message });
  }
};

export const getSpareBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const result = await db.select().from(spares).where(eq(spares.slug, slug)).limit(1);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Spare part not found' });
    }

    return res.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error('Error fetching spare by slug:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch spare', error: error.message });
  }
};

export const createSpare = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.name || !body.slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required' });
    }

    const id = body.id || `spr-${Date.now()}`;
    const { id: _id, createdAt: _created, updatedAt: _updated, ...rest } = body;

    const newSpare: any = {
      ...rest,
      id,
      name: String(body.name),
      slug: String(body.slug),
      price: Number(body.price) || 0,
      compatibleModels: Array.isArray(body.compatibleModels) ? body.compatibleModels : [],
      images: Array.isArray(body.images) ? body.images : [],
      updatedAt: new Date(),
    };

    const inserted = await db.insert(spares).values(newSpare).returning();
    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (error: any) {
    console.error('Error creating spare part:', error);
    return res.status(500).json({ success: false, message: 'Failed to create spare part', error: error.message });
  }
};

export const updateSpare = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const body = req.body;

    // Strip id, createdAt, and updatedAt to prevent Drizzle timestamp string type errors
    const { id: _id, createdAt: _created, updatedAt: _updated, ...cleanData } = body;

    const updateData: any = {
      ...cleanData,
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = String(body.name);
    if (body.slug !== undefined) updateData.slug = String(body.slug);
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price) || 0;
    if (body.compatibleModels !== undefined) {
      updateData.compatibleModels = Array.isArray(body.compatibleModels) ? body.compatibleModels : [];
    }
    if (body.images !== undefined) {
      updateData.images = Array.isArray(body.images) ? body.images : [];
    }
    if (body.whatsappMessage !== undefined) updateData.whatsappMessage = body.whatsappMessage;

    const updated = await db
      .update(spares)
      .set(updateData)
      .where(eq(spares.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Spare part not found' });
    }

    return res.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error('Error updating spare part:', error);
    return res.status(500).json({ success: false, message: 'Failed to update spare part', error: error.message });
  }
};

export const deleteSpare = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await db.delete(spares).where(eq(spares.id, id)).returning();

    if (deleted.length === 0) {
      return res.status(404).json({ success: false, message: 'Spare part not found' });
    }

    return res.json({ success: true, message: 'Spare part deleted successfully', data: deleted[0] });
  } catch (error: any) {
    console.error('Error deleting spare part:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete spare part', error: error.message });
  }
};
