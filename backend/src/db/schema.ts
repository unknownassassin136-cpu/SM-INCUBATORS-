import { pgTable, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// 1. Products Table
export const products = pgTable('products', {
  id: varchar('id', { length: 100 }).primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: text('name').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  capacity: integer('capacity').notNull().default(0),
  price: integer('price').notNull().default(0),
  originalPrice: integer('original_price'),
  shortDescription: text('short_description'),
  description: text('description'),
  image: text('image'),
  images: jsonb('images').$type<string[]>().default([]),
  features: jsonb('features').$type<string[]>().default([]),
  specifications: jsonb('specifications').$type<Record<string, string>>().default({}),
  applications: jsonb('applications').$type<string[]>().default([]),
  birds: jsonb('birds').$type<string[]>().default([]),
  warranty: varchar('warranty', { length: 100 }).default('1 Year'),
  delivery: varchar('delivery', { length: 100 }).default('Ships within 2-3 business days'),
  availability: varchar('availability', { length: 50 }).default('In Stock'),
  relatedProducts: jsonb('related_products').$type<string[]>().default([]),
  whatsappMessage: text('whatsapp_message'),
  automationType: varchar('automation_type', { length: 50 }),
  bodyMaterial: varchar('body_material', { length: 50 }),
  packagingCharges: varchar('packaging_charges', { length: 50 }).default('Extra'),
  transportCharges: varchar('transport_charges', { length: 50 }).default('Extra'),
  currency: varchar('currency', { length: 10 }).default('INR'),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 2. Spare Parts Table
export const spares = pgTable('spares', {
  id: varchar('id', { length: 100 }).primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull().default(0),
  compatibleModels: jsonb('compatible_models').$type<string[]>().default([]),
  images: jsonb('images').$type<string[]>().default([]),
  whatsappMessage: text('whatsapp_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 3. Dynamic Site Content Table (Hero, FAQs, Settings, About)
export const siteContent = pgTable('site_content', {
  key: varchar('key', { length: 100 }).primaryKey(),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 4. Inquiries / Orders Table
export const orders = pgTable('orders', {
  id: varchar('id', { length: 100 }).primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  customerAddress: text('customer_address').notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 20 }).notNull(),
  itemName: varchar('item_name', { length: 255 }).notNull(),
  itemModel: varchar('item_model', { length: 100 }),
  itemType: varchar('item_type', { length: 50 }).default('product'),
  price: integer('price').notNull().default(0),
  shippingCharge: integer('shipping_charge').notNull().default(0),
  totalAmount: integer('total_amount').notNull().default(0),
  status: varchar('status', { length: 50 }).default('Pending'),
  notes: text('notes'),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 150 }),
  referrer: text('referrer'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 5. Admins Table
export const admins = pgTable('admins', {
  id: varchar('id', { length: 100 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).default('Admin'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

