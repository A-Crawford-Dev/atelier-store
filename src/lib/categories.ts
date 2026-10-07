import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import type { Img } from "@/lib/images";

export type Category = {
  slug: string;
  title: string;
  image: Img;
};

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.categories.findMany({ orderBy: [asc(categories.sortOrder)] });
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    image: { src: row.imageUrl, alt: row.imageAlt },
  }));
}
