import Image from "next/image";
import Link from "next/link";
import { formatPrice, getStockState, type Product } from "@/lib/products";

const sizes = "(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 50vw";

export function ProductCard({ product }: { product: Product }) {
  const [primary, alternate] = product.images;
  const stock = getStockState(product.stock);
  const badge = stock.status === "sold_out" ? stock.label : product.isNew ? "New" : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="media-frame aspect-product">
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          sizes={sizes}
          className="media-cover transition-[transform,opacity] duration-700 group-hover:scale-[1.03]"
        />
        {/* Second shot fades in on hover (pointer devices only) */}
        {alternate && (
          <Image
            src={alternate.src}
            alt=""
            fill
            sizes={sizes}
            className="media-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {badge && (
          <span className="text-label absolute top-3 left-3 bg-paper px-2 py-1">{badge}</span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-0.5 pr-2">
        <h3 className="text-title">{product.name}</h3>
        <p className="text-price text-muted">{formatPrice(product.price)}</p>
        {product.colors > 1 && <p className="text-2xs text-muted">{product.colors} colors</p>}
      </div>
    </Link>
  );
}
