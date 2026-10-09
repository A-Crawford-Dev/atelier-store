import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryRail } from "@/components/home/category-rail";
import { ProductListing } from "@/components/product-listing";
import { getCategories, getCategoryBySlug } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const description = `Shop ${category.title.toLowerCase()} from Atelier.`;
  return {
    title: category.title,
    description,
    openGraph: {
      title: category.title,
      description,
      images: [{ url: category.image.src, alt: category.image.alt }],
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <>
      <ProductListing
        eyebrow="Collection"
        title={category.title}
        products={products}
        order="New pieces first"
        emptyMessage={`Our ${category.title.toLowerCase()} collection is coming soon.`}
        emptyAction={{ label: "Shop New Arrivals", href: "/new" }}
      />
      <div className="border-t border-line">
        <CategoryRail currentSlug={category.slug} />
      </div>
    </>
  );
}
