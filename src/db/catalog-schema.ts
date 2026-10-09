// Catalog tables: categories, products, product images, stock and merchandised collections.
// Prices are integer minor units (cents); currency is the app-level CURRENCY constant.

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    sku: text("sku").notNull().unique(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    /** The colorway shown */
    color: text("color").notNull(),
    /** Number of colorways offered, for the "3 colors" label */
    colorCount: integer("color_count").notNull().default(1),
    isNew: boolean("is_new").notNull().default(false),
    description: text("description").notNull(),
    details: text("details").array().notNull().default(sql`'{}'::text[]`),
    care: text("care").notNull(),
    madeIn: text("made_in").notNull(),
    ...timestamps,
  },
  (t) => [
    index("products_category_id_idx").on(t.categoryId),
    check("products_price_nonnegative", sql`${t.price} >= 0`),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** 0 is the primary image; the rest are detail shots */
    position: integer("position").notNull(),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
  },
  (t) => [unique("product_images_product_position_unique").on(t.productId, t.position)],
);

/** One row per product; a missing row means sold out */
export const productStock = pgTable(
  "product_stock",
  {
    productId: uuid("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    updatedAt: timestamps.updatedAt,
  },
  (t) => [check("product_stock_quantity_nonnegative", sql`${t.quantity} >= 0`)],
);

/**
 * Merchandised collections (Women, Men, Gifts…). Unlike categories, a product
 * can belong to any number of collections.
 */
export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Merchandising order within the collection */
    position: integer("position").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.collectionId, t.productId] }),
    index("collection_products_product_id_idx").on(t.productId),
  ],
);

export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(collectionProducts),
}));

export const collectionProductsRelations = relations(collectionProducts, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionProducts.collectionId],
    references: [collections.id],
  }),
  product: one(products, { fields: [collectionProducts.productId], references: [products.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  stock: one(productStock),
  collections: many(collectionProducts),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, { fields: [productStock.productId], references: [products.id] }),
}));
