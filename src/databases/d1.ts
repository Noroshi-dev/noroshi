import { drizzle } from 'drizzle-orm/d1';

export const getD1 = (db: D1Database) => drizzle(db);
