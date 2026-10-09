import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { collections } from "@/db/schema";

export type Collection = {
  slug: string;
  title: string;
  description: string;
};

function toCollection(row: typeof collections.$inferSelect): Collection {
  return { slug: row.slug, title: row.title, description: row.description };
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.collections.findMany({ orderBy: [asc(collections.sortOrder)] });
  return rows.map(toCollection);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const row = await db.query.collections.findFirst({ where: eq(collections.slug, slug) });
  return row && toCollection(row);
}
