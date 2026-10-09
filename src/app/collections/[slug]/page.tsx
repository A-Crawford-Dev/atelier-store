import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryRail } from "@/components/home/category-rail";
import { ProductListing } from "@/components/product-listing";
import { getCollectionBySlug, getCollections } from "@/lib/collections";
import { getProductsByCollection } from "@/lib/products";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.description,
    openGraph: { title: collection.title, description: collection.description },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await getProductsByCollection(collection.slug);

  return (
    <>
      <ProductListing
        eyebrow="Collection"
        title={collection.title}
        intro={collection.description}
        products={products}
        emptyMessage={`The ${collection.title.toLowerCase()} collection is coming soon.`}
        emptyAction={{ label: "Shop New Arrivals", href: "/new" }}
      />
      <div className="border-t border-line">
        <CategoryRail />
      </div>
    </>
  );
}
