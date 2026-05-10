import 'dotenv/config';
import {PrismaClient} from '@prisma/client';
import pg from 'pg';
import {PrismaPg} from '@prisma/adapter-pg';

// create the pool and adapter
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

// Export a single instance of prisma to be used everywhere
export const prisma = new PrismaClient({adapter});