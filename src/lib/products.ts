// Product catalog, read from Postgres. Accessors are cached ("use cache") and tagged
// "products" so writes can refresh them with revalidateTag("products").

import { asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import {
  categories,
  collectionProducts,
  collections,
  productImages,
  products,
  productStock,
} from "@/db/schema";
import type { Img } from "@/lib/images";

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: { id: string; slug: string; title: string };
  price: number; // minor units (cents)
  color: string;
  colors: number;
  stock: number;
  isNew?: boolean;
  description: string;
  details: string[];
  care: string;
  madeIn: string;
  /** First image is the primary; the rest are detail shots */
  images: Img[];
};

export type StockState =
  | { status: "in_stock"; label: string }
  | { status: "low_stock"; label: string }
  | { status: "sold_out"; label: string };

export const CURRENCY = "USD";
const LOW_STOCK_THRESHOLD = 3;

export function formatPrice(minor: number, currency = CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(minor / 100);
}

export function getStockState(stock: number): StockState {
  if (stock <= 0) return { status: "sold_out", label: "Sold Out" };
  if (stock <= LOW_STOCK_THRESHOLD) return { status: "low_stock", label: `Only ${stock} left` };
  return { status: "in_stock", label: "In Stock" };
}

const withRelations = {
  category: true,
  images: { orderBy: asc(productImages.position) },
  stock: true,
} as const;

type ProductRow = typeof products.$inferSelect & {
  category: typeof categories.$inferSelect;
  images: (typeof productImages.$inferSelect)[];
  stock: typeof productStock.$inferSelect | null;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    category: { id: row.category.id, slug: row.category.slug, title: row.category.title },
    price: row.price,
    color: row.color,
    colors: row.colorCount,
    stock: row.stock?.quantity ?? 0,
    isNew: row.isNew,
    description: row.description,
    details: row.details,
    care: row.care,
    madeIn: row.madeIn,
    images: row.images.map((image) => ({ src: image.url, alt: image.alt })),
  };
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    with: withRelations,
    orderBy: [asc(products.createdAt), asc(products.sku)],
  });
  return rows.map(toProduct);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    with: withRelations,
    orderBy: [desc(products.isNew), desc(products.createdAt), asc(products.sku)],
    limit,
  });
  return rows.map(toProduct);
}

/** Every product flagged as new, newest first — the full New Arrivals listing */
export async function getNewInProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    with: withRelations,
    where: eq(products.isNew, true),
    orderBy: [desc(products.createdAt), asc(products.sku)],
  });
  return rows.map(toProduct);
}

/** All products in a category, new pieces first, then newest */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    with: withRelations,
    where: inArray(
      products.categoryId,
      db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)),
    ),
    orderBy: [desc(products.isNew), desc(products.createdAt), asc(products.sku)],
  });
  return rows.map(toProduct);
}

/** Products in a merchandised collection, in the collection's own order */
export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.collectionProducts.findMany({
    where: inArray(
      collectionProducts.collectionId,
      db.select({ id: collections.id }).from(collections).where(eq(collections.slug, collectionSlug)),
    ),
    orderBy: [asc(collectionProducts.position)],
    with: { product: { with: withRelations } },
  });
  return rows.map((row) => toProduct(row.product));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const row = await db.query.products.findFirst({
    with: withRelations,
    where: eq(products.slug, slug),
  });
  return row && toProduct(row);
}

/** Same-category products first, then the rest of the catalog */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return relatedProducts(product.id, product.category.id, limit);
}

// Takes ids rather than the whole product so the cache key stays small
async function relatedProducts(productId: string, categoryId: string, limit: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    with: withRelations,
    where: ne(products.id, productId),
    orderBy: [
      desc(sql`${products.categoryId} = ${categoryId}`),
      desc(products.createdAt),
      asc(products.sku),
    ],
    limit,
  });
  return rows.map(toProduct);
}
