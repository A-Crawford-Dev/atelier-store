import type { Metadata } from "next";
import { CategoryRail } from "@/components/home/category-rail";
import { ProductListing } from "@/components/product-listing";
import { getNewInProducts } from "@/lib/products";

const intro =
  "The latest pieces from the atelier — new leather goods, ready-to-wear and jewelry, added as they arrive from our workshops.";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: intro,
};

export default async function NewArrivalsPage() {
  const products = await getNewInProducts();

  return (
    <>
      <ProductListing
        eyebrow="New In"
        title="New Arrivals"
        intro={intro}
        products={products}
        order="Newest first"
        emptyMessage="New pieces are on their way. Check back soon."
        emptyAction={{ label: "Continue Shopping", href: "/" }}
      />
      <div className="border-t border-line">
        <CategoryRail />
      </div>
    </>
  );
}
