import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { siteContent } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Default fallback content if DB is empty initially
const defaultSiteData: Record<string, any> = {
  hero: {
    badge: 'Premium Egg Incubators',
    titleLine1: 'Precision Incubation.',
    titleLine2: 'Trusted Results.',
    description:
      'Manufactured with industrial-grade materials and advanced microcomputer technology to ensure the highest hatch rates for your poultry business.',
    heroImage: '/assets/images/hero/main.jpeg',
    primaryButtonText: 'Explore Products',
    primaryButtonLink: '/products',
    secondaryButtonText: 'Shop Now',
    secondaryButtonLink: '/products',
  },
  settings: {
    brandName: 'SM Incubators',
    tagline: 'Precision Incubation',
    phone: '7981081579',
    whatsappNumber: '917981081579',
    upiId: '7981081579@ptyes',
    upiQrImage: '/assets/images/upi-qr.png',
    address: 'Chinamiram, Balram Raju Nagar, Bhimavaram, Andhra Pradesh - 534204',
  },
};

export const getContent = async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);
    const result = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);

    if (result.length > 0) {
      return res.json({ success: true, data: result[0].data });
    }

    // Fallback to default
    if (defaultSiteData[key]) {
      return res.json({ success: true, data: defaultSiteData[key] });
    }

    return res.status(404).json({ success: false, message: `Content not found for key: ${key}` });
  } catch (error: any) {
    console.error(`Error fetching content for ${req.params.key}:`, error);
    const key = String(req.params.key);
    if (defaultSiteData[key]) {
      return res.json({ success: true, data: defaultSiteData[key], fallback: true });
    }
    return res.status(500).json({ success: false, message: 'Failed to fetch content', error: error.message });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: 'Content data is required' });
    }

    const existing = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);

    let result;
    if (existing.length > 0) {
      result = await db
        .update(siteContent)
        .set({ data, updatedAt: new Date() })
        .where(eq(siteContent.key, key))
        .returning();
    } else {
      result = await db.insert(siteContent).values({ key, data, updatedAt: new Date() }).returning();
    }

    return res.json({ success: true, message: `Content updated for ${key}`, data: result[0].data });
  } catch (error: any) {
    console.error(`Error updating content for ${req.params.key}:`, error);
    return res.status(500).json({ success: false, message: 'Failed to update content', error: error.message });
  }
};
