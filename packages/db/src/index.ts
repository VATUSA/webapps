import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

/** Database connection. */
export const db = drizzle(process.env.DATABASE_URL!);
