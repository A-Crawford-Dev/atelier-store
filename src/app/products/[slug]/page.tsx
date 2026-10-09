import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/home/section-header";
import { Disclosure } from "@/components/product/disclosure";
import { ProductGallery } from "@/components/product/product-gallery";
import { StockIndicator } from "@/components/product/stock-indicator";
import { ProductGrid } from "@/components/product-grid";
import { categoryHref } from "@/lib/routes";
import {
  CURRENCY,
  formatPrice,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  getStockState,
} from "@/lib/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const stock = getStockState(product.stock);
  const soldOut = stock.status === "sold_out";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.images.map((image) => image.src),
    category: product.category.title,
    color: product.color,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: CURRENCY,
      availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="grid lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <ProductGallery images={product.images} />
        </div>

        <div className="px-gutter pt-6 pb-section lg:col-span-5 lg:px-10 lg:pt-10 xl:col-span-4 xl:px-14">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
            <header className="flex flex-col gap-3">
              <Link
                href={categoryHref(product.category.slug)}
                className="text-label link-reveal self-start text-muted"
              >
                {product.category.title}
              </Link>
              <h1 className="text-2xl lg:text-3xl">{product.name}</h1>
              <p className="text-price text-base">{formatPrice(product.price)}</p>
            </header>

            <dl className="flex flex-col gap-3 border-y border-line py-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Color</dt>
                <dd>
                  {product.color}
                  {product.colors > 1 && (
                    <span className="text-muted"> · {product.colors} colors</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Availability</dt>
                <dd>
                  <StockIndicator state={stock} />
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-3">
              {/* TODO: wire to the cart once it exists */}
              <button type="button" className="btn btn-primary btn-block" disabled={soldOut}>
                {soldOut ? "Sold Out" : "Add to Bag"}
              </button>
              <Link href="/services/appointments" className="btn btn-secondary btn-block">
                Book an Appointment
              </Link>
              <p className="text-center text-2xs text-muted">
                Complimentary shipping and returns · Style {product.sku}
              </p>
            </div>

            <p className="text-sm leading-6">{product.description}</p>

            <div className="border-t border-line">
              <Disclosure title="Details" defaultOpen>
                <ul className="flex flex-col gap-1.5">
                  {product.details.map((detail) => (
                    <li key={detail} className="before:mr-2 before:content-['—']">
                      {detail}
                    </li>
                  ))}
                </ul>
              </Disclosure>
              <Disclosure title="Materials & Care">
                <p>{product.care}</p>
                <p className="mt-2">Made in {product.madeIn}.</p>
              </Disclosure>
              <Disclosure title="Shipping & Returns">
                <p>
                  Complimentary express delivery in 2–4 business days, packed in our signature
                  box. Return or exchange within 30 days, online or in store.
                </p>
              </Disclosure>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="container-page section-y border-t border-line">
          <SectionHeader title="You May Also Like" />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
