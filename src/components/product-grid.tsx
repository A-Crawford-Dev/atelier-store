import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

/**
 * `grid-products` (2 → 3 → 4 columns) with one tweak: in the 3-column tablet
 * range, products that would leave a partial last row are hidden.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  const fullRowsOfThree = products.length - (products.length % 3);

  return (
    <ul className="grid-products">
      {products.map((product, i) => (
        <li key={product.id} className={i >= fullRowsOfThree ? "md:max-xl:hidden" : undefined}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
