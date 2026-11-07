import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString || connectionString.includes('yourprojectref')) {
  console.warn('⚠️ WARNING: DATABASE_URL is not configured yet or has placeholder credentials in backend/.env');
}

// Disable prefetch as it is not supported for "Transaction" pooler mode in Supabase
const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

