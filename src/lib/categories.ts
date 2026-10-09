import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import type { Img } from "@/lib/images";

export type Category = {
  slug: string;
  title: string;
  image: Img;
};

function toCategory(row: typeof categories.$inferSelect): Category {
  return {
    slug: row.slug,
    title: row.title,
    image: { src: row.imageUrl, alt: row.imageAlt },
  };
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.categories.findMany({ orderBy: [asc(categories.sortOrder)] });
  return rows.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const row = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
  return row && toCategory(row);
}
