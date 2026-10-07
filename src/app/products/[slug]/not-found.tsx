import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="container-prose section-y flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-label text-muted">Product not found</p>
      <h1 className="text-heading">This piece is no longer available</h1>
      <p className="text-sm text-muted">
        It may have sold out or been moved. Explore the latest arrivals instead.
      </p>
      <Link href="/" className="btn btn-primary">
        Continue Shopping
      </Link>
    </section>
  );
}
