import Link from "next/link";

/** Not-found body for category and collection listings */
export function ListingNotFound() {
  return (
    <section className="container-prose section-y flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-label text-muted">Collection not found</p>
      <h1 className="text-heading">This collection isn’t available</h1>
      <p className="text-sm text-muted">
        It may have moved or been retired. Explore the latest arrivals instead.
      </p>
      <Link href="/new" className="btn btn-primary">
        Shop New Arrivals
      </Link>
    </section>
  );
}
