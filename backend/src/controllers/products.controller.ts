import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { products } from '../db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import {
  escapeCSV,
  parseCSV,
  parseSpecsString,
  formatSpecsString,
} from '../utils/csv.js';

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const allProducts = await db.select().from(products).orderBy(products.createdAt);
    return res.json({ success: true, data: allProducts });
  } catch (error: any) {
    console.error('Error fetching products from database:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error('Error fetching product by slug:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.name || !body.slug || !body.category) {
      return res.status(400).json({ success: false, message: 'Name, slug, and category are required' });
    }

    const id = body.id || `SMI-${Date.now()}`;
    const newProduct = {
      ...body,
      id,
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      capacity: Number(body.capacity) || 0,
      updatedAt: new Date(),
    };

    const inserted = await db.insert(products).values(newProduct).returning();
    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const body = req.body;

    // Strip id, createdAt, and updatedAt to prevent Drizzle timestamp string type errors
    const { id: _id, createdAt: _created, updatedAt: _updated, ...cleanData } = body;

    const updateData: any = {
      ...cleanData,
      price: body.price !== undefined ? Number(body.price) : undefined,
      originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : null) : undefined,
      capacity: body.capacity !== undefined ? Number(body.capacity) : undefined,
      updatedAt: new Date(),
    };

    if (body.images !== undefined) {
      updateData.images = Array.isArray(body.images) ? body.images : [];
    }
    if (body.features !== undefined) {
      updateData.features = Array.isArray(body.features) ? body.features : [];
    }
    if (body.specifications !== undefined) {
      updateData.specifications = body.specifications || {};
    }
    if (body.applications !== undefined) {
      updateData.applications = Array.isArray(body.applications) ? body.applications : [];
    }
    if (body.birds !== undefined) {
      updateData.birds = Array.isArray(body.birds) ? body.birds : [];
    }
    if (body.relatedProducts !== undefined) {
      updateData.relatedProducts = Array.isArray(body.relatedProducts) ? body.relatedProducts : [];
    }

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await db.delete(products).where(eq(products.id, id)).returning();

    if (deleted.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product deleted successfully', data: deleted[0] });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

// =========================================================================
// CSV EXPORT & TEMPLATE
// =========================================================================

export const exportProductsCSV = async (_req: Request, res: Response) => {
  try {
    const allProducts = await db.select().from(products).orderBy(products.createdAt);

    const headers = [
      'id',
      'slug',
      'name',
      'category',
      'capacity',
      'price',
      'originalPrice',
      'shortDescription',
      'description',
      'image',
      'images',
      'features',
      'specifications',
      'warranty',
      'delivery',
      'availability',
    ];

    const lines: string[] = [headers.join(',')];

    for (const p of allProducts) {
      const imagesStr = Array.isArray(p.images) ? p.images.join(' | ') : '';
      const featuresStr = Array.isArray(p.features) ? p.features.join(' | ') : '';
      const specsStr = formatSpecsString(p.specifications);

      const row = [
        escapeCSV(p.id),
        escapeCSV(p.slug),
        escapeCSV(p.name),
        escapeCSV(p.category),
        escapeCSV(p.capacity),
        escapeCSV(p.price),
        escapeCSV(p.originalPrice || ''),
        escapeCSV(p.shortDescription || ''),
        escapeCSV(p.description || ''),
        escapeCSV(p.image || ''),
        escapeCSV(imagesStr),
        escapeCSV(featuresStr),
        escapeCSV(specsStr),
        escapeCSV(p.warranty || ''),
        escapeCSV(p.delivery || ''),
        escapeCSV(p.availability || ''),
      ];
      lines.push(row.join(','));
    }

    const csvData = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="smincubators_products.csv"');
    return res.send(csvData);
  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    return res.status(500).json({ success: false, message: 'Failed to export products CSV', error: error.message });
  }
};

export const downloadProductsTemplateCSV = (_req: Request, res: Response) => {
  const headers = [
    'id',
    'slug',
    'name',
    'category',
    'capacity',
    'price',
    'originalPrice',
    'shortDescription',
    'description',
    'image',
    'images',
    'features',
    'specifications',
    'warranty',
    'delivery',
    'availability',
  ];

  const sampleRows = [
    [
      'SMI-SAMPLE-50FA',
      '50-egg-fully-automatic-sample',
      '50 Egg Thermocol Fully Automatic Sample',
      'Thermocol Fully Automatic',
      '50',
      '5500',
      '6500',
      '50-egg incubator with digital controller',
      'High hatch rate 50 egg automatic incubator designed for poultry farmers.',
      '/assets/images/products/prod1/main.jpg',
      '/assets/images/products/prod1/main.jpg | /assets/images/products/prod1/1.jpeg',
      'Auto egg turning | Digital thermostat | Energy efficient',
      'Model:SMI50FA;Brand:SM Incubators;Warranty:1 Year;HSN:84362100',
      '1 Year',
      'Ships within 2-3 business days',
      'In Stock',
    ],
    [
      'SMI-SAMPLE-100FAW',
      '100-egg-wooden-automatic-sample',
      '100 Egg Wooden Fully Automatic Sample',
      'Wooden Fully Automatic',
      '100',
      '14500',
      '16000',
      'Commercial-grade wooden egg incubator',
      'Durable wooden body with microcomputer temperature and humidity control.',
      '/assets/images/products/prod3/main.jpg',
      '/assets/images/products/prod3/main.jpg',
      'Dual power 220V/12V | Automatic rolling tray | Forced air circulation',
      'Model:SMI100W;Brand:SM Incubators;Warranty:1 Year',
      '1 Year',
      'Ships within 3-5 business days',
      'In Stock',
    ],
  ];

  const lines = [
    headers.join(','),
    ...sampleRows.map((r) => r.map((f) => escapeCSV(f)).join(',')),
  ];

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="products_import_template.csv"');
  return res.send(lines.join('\n'));
};

// =========================================================================
// BULK UPLOAD WITH 4 LOGIC MODES (Dry Run, Upsert, Insert Only, Update Only)
// =========================================================================

export type BulkMode = 'dry_run' | 'upsert' | 'insert_only' | 'update_only';

interface ParsedProductItem {
  rowNumber: number;
  id?: string;
  slug: string;
  name: string;
  category: string;
  capacity: number;
  price: number;
  originalPrice?: number | null;
  shortDescription: string;
  description: string;
  image?: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  warranty: string;
  delivery: string;
  availability: string;
}

export const bulkUploadProducts = async (req: Request, res: Response) => {
  try {
    const rawCSV = req.file ? req.file.buffer.toString('utf-8') : req.body.csvContent;
    const mode: BulkMode = (req.body.mode as BulkMode) || 'dry_run';

    if (!rawCSV || typeof rawCSV !== 'string' || !rawCSV.trim()) {
      return res.status(400).json({ success: false, message: 'CSV content or file is required' });
    }

    const grid = parseCSV(rawCSV);
    if (grid.length < 2) {
      return res.status(400).json({ success: false, message: 'CSV file contains no data rows' });
    }

    const headers = grid[0].map((h) => h.toLowerCase().trim());
    const getIndex = (name: string) => headers.indexOf(name.toLowerCase());

    const idIdx = getIndex('id');
    const slugIdx = getIndex('slug');
    const nameIdx = getIndex('name');
    const categoryIdx = getIndex('category');
    const capacityIdx = getIndex('capacity');
    const priceIdx = getIndex('price');
    const originalPriceIdx = getIndex('originalprice');
    const shortDescIdx = getIndex('shortdescription');
    const descIdx = getIndex('description');
    const imageIdx = getIndex('image');
    const imagesIdx = getIndex('images');
    const featuresIdx = getIndex('features');
    const specsIdx = getIndex('specifications');
    const warrantyIdx = getIndex('warranty');
    const deliveryIdx = getIndex('delivery');
    const availabilityIdx = getIndex('availability');

    if (slugIdx === -1 || nameIdx === -1 || categoryIdx === -1) {
      return res.status(400).json({
        success: false,
        message: 'CSV missing required column headers: "slug", "name", and "category" are mandatory.',
      });
    }

    // Fetch all existing products from database for comparison
    const existingProducts = await db.select().from(products);
    const existingBySlug = new Map<string, typeof products.$inferSelect>();
    const existingById = new Map<string, typeof products.$inferSelect>();

    for (const p of existingProducts) {
      existingBySlug.set(p.slug.toLowerCase(), p);
      if (p.id) existingById.set(p.id.toLowerCase(), p);
    }

    const rowsReport: any[] = [];
    const validItemsToProcess: { item: ParsedProductItem; matchedExisting?: typeof products.$inferSelect }[] = [];
    const encounteredSlugsInCSV = new Set<string>();

    let newCount = 0;
    let updateCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let r = 1; r < grid.length; r++) {
      const row = grid[r];
      const rowNum = r + 1; // 1-indexed for human readability (header is 1)

      const slug = (row[slugIdx] || '').trim();
      const name = (row[nameIdx] || '').trim();
      const category = (row[categoryIdx] || '').trim();
      const id = idIdx !== -1 && row[idIdx] ? row[idIdx].trim() : undefined;
      const rawPrice = priceIdx !== -1 ? row[priceIdx] : '0';
      const price = Number(rawPrice);
      const rawCapacity = capacityIdx !== -1 ? row[capacityIdx] : '0';
      const capacity = Number(rawCapacity) || 0;
      const rawOriginalPrice = originalPriceIdx !== -1 && row[originalPriceIdx] ? Number(row[originalPriceIdx]) : null;

      const shortDescription = shortDescIdx !== -1 ? row[shortDescIdx] || '' : '';
      const description = descIdx !== -1 ? row[descIdx] || '' : '';
      const image = imageIdx !== -1 ? row[imageIdx] || '' : '';
      const imagesRaw = imagesIdx !== -1 ? row[imagesIdx] || '' : '';
      const images = imagesRaw ? imagesRaw.split('|').map((s) => s.trim()).filter(Boolean) : (image ? [image] : []);
      const featuresRaw = featuresIdx !== -1 ? row[featuresIdx] || '' : '';
      const features = featuresRaw ? featuresRaw.split('|').map((s) => s.trim()).filter(Boolean) : [];
      const specsRaw = specsIdx !== -1 ? row[specsIdx] || '' : '';
      const specifications = parseSpecsString(specsRaw);
      const warranty = warrantyIdx !== -1 ? row[warrantyIdx] || '1 Year' : '1 Year';
      const delivery = deliveryIdx !== -1 ? row[deliveryIdx] || 'Ships within 2-3 business days' : 'Ships within 2-3 business days';
      const availability = availabilityIdx !== -1 ? row[availabilityIdx] || 'In Stock' : 'In Stock';

      const rowErrors: string[] = [];

      if (!name) rowErrors.push('Product name is required.');
      if (!slug) rowErrors.push('URL slug is required.');
      if (!category) rowErrors.push('Category is required.');
      if (isNaN(price) || price < 0) rowErrors.push('Price must be a valid positive number.');
      if (isNaN(capacity) || capacity < 0) rowErrors.push('Capacity must be a non-negative number.');

      const normalizedSlug = slug.toLowerCase();
      if (encounteredSlugsInCSV.has(normalizedSlug)) {
        rowErrors.push(`Duplicate slug "${slug}" detected within the same CSV upload.`);
      } else {
        encounteredSlugsInCSV.add(normalizedSlug);
      }

      if (rowErrors.length > 0) {
        errorCount++;
        rowsReport.push({
          rowNumber: rowNum,
          name: name || 'Unnamed',
          slug: slug || 'none',
          category,
          price,
          action: 'ERROR',
          message: rowErrors.join('; '),
          errors: rowErrors,
        });
        continue;
      }

      // Check if product exists in database by slug or id
      const matched = existingBySlug.get(normalizedSlug) || (id ? existingById.get(id.toLowerCase()) : undefined);

      const parsedItem: ParsedProductItem = {
        rowNumber: rowNum,
        id: id || matched?.id || `SMI-${Date.now()}-${r}`,
        slug,
        name,
        category,
        capacity,
        price,
        originalPrice: rawOriginalPrice,
        shortDescription,
        description,
        image: image || (images[0] || ''),
        images,
        features,
        specifications,
        warranty,
        delivery,
        availability,
      };

      if (matched) {
        // Exists in DB
        const changes: Record<string, { old: any; new: any }> = {};
        if (matched.name !== name) changes['name'] = { old: matched.name, new: name };
        if (matched.price !== price) changes['price'] = { old: matched.price, new: price };
        if (matched.category !== category) changes['category'] = { old: matched.category, new: category };
        if (matched.capacity !== capacity) changes['capacity'] = { old: matched.capacity, new: capacity };
        if (matched.availability !== availability) changes['availability'] = { old: matched.availability, new: availability };

        if (mode === 'insert_only') {
          skippedCount++;
          rowsReport.push({
            rowNumber: rowNum,
            name,
            slug,
            category,
            price,
            action: 'SKIPPED',
            message: 'Product already exists in database (skipped due to "Insert New Only" mode).',
          });
        } else {
          updateCount++;
          rowsReport.push({
            rowNumber: rowNum,
            name,
            slug,
            category,
            price,
            action: 'UPDATE',
            message: Object.keys(changes).length > 0 ? `Will update fields: ${Object.keys(changes).join(', ')}` : 'No value changes detected, will refresh record.',
            changes,
          });
          validItemsToProcess.push({ item: parsedItem, matchedExisting: matched });
        }
      } else {
        // Brand new product
        if (mode === 'update_only') {
          skippedCount++;
          rowsReport.push({
            rowNumber: rowNum,
            name,
            slug,
            category,
            price,
            action: 'SKIPPED',
            message: 'Product not found in database (skipped due to "Update Existing Only" mode).',
          });
        } else {
          newCount++;
          rowsReport.push({
            rowNumber: rowNum,
            name,
            slug,
            category,
            price,
            action: 'NEW',
            message: 'New product ready for insertion.',
          });
          validItemsToProcess.push({ item: parsedItem });
        }
      }
    }

    // If DRY RUN: return validation report without database operations
    if (mode === 'dry_run') {
      return res.json({
        success: true,
        mode: 'dry_run',
        message: 'Dry run completed. No database changes were made.',
        summary: {
          totalRows: grid.length - 1,
          newCount,
          updateCount,
          skippedCount,
          errorCount,
        },
        rows: rowsReport,
      });
    }

    // Execute actual database modifications (upsert, insert_only, or update_only)
    let committedInserts = 0;
    let committedUpdates = 0;

    for (const { item, matchedExisting } of validItemsToProcess) {
      if (matchedExisting) {
        // Update
        await db
          .update(products)
          .set({
            name: item.name,
            category: item.category,
            capacity: item.capacity,
            price: item.price,
            originalPrice: item.originalPrice,
            shortDescription: item.shortDescription,
            description: item.description,
            image: item.image,
            images: item.images,
            features: item.features,
            specifications: item.specifications,
            warranty: item.warranty,
            delivery: item.delivery,
            availability: item.availability,
            updatedAt: new Date(),
          })
          .where(eq(products.id, matchedExisting.id));
        committedUpdates++;
      } else {
        // Insert
        await db.insert(products).values({
          id: item.id!,
          slug: item.slug,
          name: item.name,
          category: item.category,
          capacity: item.capacity,
          price: item.price,
          originalPrice: item.originalPrice,
          shortDescription: item.shortDescription,
          description: item.description,
          image: item.image,
          images: item.images,
          features: item.features,
          specifications: item.specifications,
          warranty: item.warranty,
          delivery: item.delivery,
          availability: item.availability,
          isFeatured: true,
        });
        committedInserts++;
      }
    }

    return res.json({
      success: true,
      mode,
      message: `Bulk import completed successfully! ${committedInserts} created, ${committedUpdates} updated, ${skippedCount} skipped, ${errorCount} errors.`,
      summary: {
        totalRows: grid.length - 1,
        committedInserts,
        committedUpdates,
        skippedCount,
        errorCount,
      },
      rows: rowsReport,
    });
  } catch (error: any) {
    console.error('Error during bulk upload:', error);
    return res.status(500).json({ success: false, message: 'Bulk upload failed', error: error.message });
  }
};
