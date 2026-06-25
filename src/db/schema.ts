import {
  pgTable,
  serial,
  text,
  numeric,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

/** Purchasable digital products: website templates, source code packs, services. */
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  // website | template | app | service
  category: text("category").notNull().default("template"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 12, scale: 2 }),
  imageUrl: text("image_url"),
  fileUrl: text("file_url"),
  demoUrl: text("demo_url"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  live: boolean("live").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/** Purchase orders for USDT (TRC20) template payments. */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  templateId: integer("template_id").references(() => templates.id),
  templateTitle: text("template_title"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  wallet: text("wallet").notNull(),
  buyerName: text("buyer_name"),
  buyerEmail: text("buyer_email"),
  buyerTelegram: text("buyer_telegram"),
  txid: text("txid"),
  // pending | paid | delivered | cancelled
  status: text("status").notNull().default("pending"),
  note: text("note"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
