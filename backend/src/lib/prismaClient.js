import 'dotenv/config';
import { PrismaClient } from '../../node_modules/.prisma/client/index.js'; 
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Initialize the native connection pool using your environment variable
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it inside the Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the Prisma Client instance
export const prisma = new PrismaClient({ adapter });
