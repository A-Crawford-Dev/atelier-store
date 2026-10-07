import { SectionHeader } from "@/components/home/section-header";
import { ProductGrid } from "@/components/product-grid";
import { getNewArrivals } from "@/lib/products";

export async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <section className="container-page section-y">
      <SectionHeader
        eyebrow="Just In"
        title="New Arrivals"
        link={{ label: "View All", href: "/new" }}
      />
      <ProductGrid products={products} />
    </section>
  );
}
