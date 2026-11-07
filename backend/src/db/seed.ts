import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './index.js';
import { products, spares, siteContent } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log('🌱 Starting database seed into Supabase...');

  try {
    // 1. Seed Products from public/assets/data/products.json
    const productsPath = path.resolve(__dirname, '../../../public/assets/data/products.json');
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      console.log(`📦 Found ${productsData.length} products to seed...`);

      for (const item of productsData) {
        await db
          .insert(products)
          .values({
            id: item.id,
            slug: item.slug,
            name: item.name,
            category: item.category,
            capacity: item.capacity || 0,
            price: item.price || 0,
            originalPrice: item.originalPrice || null,
            shortDescription: item.shortDescription || '',
            description: item.description || '',
            image: item.image || (item.images && item.images[0]) || '',
            images: item.images || [],
            features: item.features || [],
            specifications: item.specifications || {},
            applications: item.applications || [],
            birds: item.birds || [],
            warranty: item.warranty || '1 Year',
            delivery: item.delivery || 'Ships within 2-3 business days',
            availability: item.availability || 'In Stock',
            relatedProducts: item.relatedProducts || [],
            whatsappMessage: item.whatsappMessage || '',
            automationType: item.automationType || '',
            bodyMaterial: item.bodyMaterial || '',
            packagingCharges: item.packagingCharges || 'Extra',
            transportCharges: item.transportCharges || 'Extra',
            currency: item.currency || 'INR',
            isFeatured: true,
          })
          .onConflictDoNothing();
      }
      console.log('✅ Products seeded successfully.');
    }

    // 2. Seed Spares from public/assets/data/spares.json
    const sparesPath = path.resolve(__dirname, '../../../public/assets/data/spares.json');
    if (fs.existsSync(sparesPath)) {
      const sparesData = JSON.parse(fs.readFileSync(sparesPath, 'utf-8'));
      console.log(`🔧 Found ${sparesData.length} spare parts to seed...`);

      for (const item of sparesData) {
        await db
          .insert(spares)
          .values({
            id: item.id,
            slug: item.slug,
            name: item.name,
            description: item.description || '',
            price: item.price || 0,
            compatibleModels: item.compatibleModels || [],
            images: item.images || [],
            whatsappMessage: item.whatsappMessage || '',
          })
          .onConflictDoNothing();
      }
      console.log('✅ Spares seeded successfully.');
    }

    // 3. Seed Initial Site Content (Hero & Settings)
    console.log('🎨 Seeding initial site content (Hero & Settings)...');
    await db
      .insert(siteContent)
      .values({
        key: 'hero',
        data: {
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
      })
      .onConflictDoNothing();

    await db
      .insert(siteContent)
      .values({
        key: 'settings',
        data: {
          brandName: 'SM Incubators',
          tagline: 'Precision Incubation',
          phone: '7981081579',
          whatsappNumber: '917981081579',
          upiId: '7981081579@ptyes',
          upiQrImage: '/assets/images/upi-qr.png',
          address: 'Chinamiram, Balram Raju Nagar, Bhimavaram, Andhra Pradesh - 534204',
        },
      })
      .onConflictDoNothing();

    await db
      .insert(siteContent)
      .values({
        key: 'footer',
        data: {
          companyName: 'SM Incubators',
          tagline: 'Precision Incubation. Trusted Results.',
          aboutText:
            'Precision Incubation. Trusted Results. We manufacture top-quality egg incubators and provide genuine spare parts for hobbyists and commercial hatcheries across India.',
          phone: '7981081579',
          whatsappNumber: '917981081579',
          email: 'srimavullammaincubator@gmail.com',
          addressLine1: 'Chinamiram',
          addressLine2: 'Balram Raju Nagar',
          city: 'Bhimavaram',
          state: 'Andhra Pradesh',
          pincode: '534204',
          copyrightText: '© 2026 SRI MAVULLAMMA INCUBATORS. All rights reserved.',
          gstNumber: 'GSTIN37XXXXXXXXXX',
          showGst: true,
          workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM (Sunday Closed)',
          socialFacebook: 'https://facebook.com',
          socialInstagram: 'https://instagram.com',
          socialYoutube: 'https://youtube.com',
          socialWhatsappChannel: 'https://whatsapp.com/channel',
          socialTwitter: '',
          trustBadgesText: '100% Tested Hatch Rates • Genuine Spare Parts Guarantee • Pan India Delivery',
          showTrustBadges: true,
        },
      })
      .onConflictDoNothing();

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();

