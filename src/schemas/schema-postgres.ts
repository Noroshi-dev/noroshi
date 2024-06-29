import { sql } from "drizzle-orm";
import { pgTable, integer, timestamp, text } from "drizzle-orm/pg-core";

export const project = pgTable("projects", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status", { enum: ["todo", "doing", "done"] }).default("todo"),
  createdAt: timestamp("created_at").default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: timestamp("updated_at").default(
    sql`(strftime('%s', 'now'))`
  ),
});