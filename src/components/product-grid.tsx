import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

type Props = {
  products: Product[];
  /**
   * Hide products that would leave a partial last row in the 3-column tablet
   * range. Right for teasers (homepage, "You May Also Like"); turn it off for
   * full listings, where every product must be reachable.
   */
  fillRows?: boolean;
};

/** `grid-products` (2 → 3 → 4 columns) of `ProductCard`s */
export function ProductGrid({ products, fillRows = true }: Props) {
  const visibleOnTablet = fillRows ? products.length - (products.length % 3) : products.length;

  return (
    <ul className="grid-products">
      {products.map((product, i) => (
        <li key={product.id} className={i >= visibleOnTablet ? "md:max-xl:hidden" : undefined}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
