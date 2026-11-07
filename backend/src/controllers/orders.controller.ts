import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { orders } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.customerName || !body.customerPhone || !body.customerAddress || !body.itemName) {
      return res.status(400).json({ success: false, message: 'Missing required order fields' });
    }

    const id = `ORD-${Date.now()}`;
    const newOrder = {
      id,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null,
      customerAddress: body.customerAddress,
      state: body.state || 'Unknown',
      pincode: body.pincode,
      itemName: body.itemName,
      itemModel: body.itemModel || null,
      itemType: body.itemType || 'product',
      price: Number(body.price) || 0,
      shippingCharge: Number(body.shippingCharge) || 0,
      totalAmount: Number(body.totalAmount) || 0,
      status: 'Pending',
      notes: body.notes || null,
      utmSource: body.utmSource || null,
      utmMedium: body.utmMedium || null,
      utmCampaign: body.utmCampaign || null,
      referrer: body.referrer || null,
    };

    const inserted = await db.insert(orders).values(newOrder).returning();
    return res.status(201).json({ success: true, message: 'Order inquiry saved successfully', data: inserted[0] });
  } catch (error: any) {
    console.error('Error creating order inquiry:', error);
    return res.status(500).json({ success: false, message: 'Failed to record order inquiry', error: error.message });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return res.json({ success: true, data: allOrders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, notes } = req.body;

    const updated = await db
      .update(orders)
      .set({
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined,
      })
      .where(eq(orders.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};
