import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/lib/products";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  products: Product[];
  /** Shown in the toolbar opposite the count, e.g. "Newest first" */
  order?: string;
  emptyMessage: string;
  emptyAction: { label: string; href: string };
};

/** Full-page product listing: page heading, count toolbar, grid or empty state */
export function ProductListing({
  eyebrow,
  title,
  intro,
  products,
  order,
  emptyMessage,
  emptyAction,
}: Props) {
  const count = `${products.length} ${products.length === 1 ? "piece" : "pieces"}`;

  return (
    <section className="container-page section-y">
      <header className="mb-8 flex flex-col gap-4 lg:mb-12">
        <p className="text-label text-muted">{eyebrow}</p>
        <h1 className="text-heading">{title}</h1>
        {intro && <p className="max-w-xl text-sm text-muted">{intro}</p>}
      </header>

      {products.length > 0 ? (
        <>
          <div className="mb-8 flex items-center justify-between border-y border-line py-4 lg:mb-10">
            <p className="text-label">{count}</p>
            {order && <p className="text-2xs tracking-label text-muted uppercase">{order}</p>}
          </div>
          {/* Full listing: every product must be reachable, so no row-filling on tablet */}
          <ProductGrid products={products} fillRows={false} />
        </>
      ) : (
        <div className="flex flex-col items-start gap-6 border-t border-line pt-10">
          <p className="text-sm text-muted">{emptyMessage}</p>
          <Link href={emptyAction.href} className="btn btn-secondary">
            {emptyAction.label}
          </Link>
        </div>
      )}
    </section>
  );
}
