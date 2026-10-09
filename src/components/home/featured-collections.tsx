import Image from "next/image";
import Link from "next/link";
import { featuredCollections } from "@/lib/catalog";
import { collectionHref } from "@/lib/routes";

export function FeaturedCollections() {
  return (
    <section aria-label="Featured collections" className="grid gap-px md:grid-cols-2">
      {featuredCollections.map((collection) => (
        <Link
          key={collection.slug}
          href={collectionHref(collection.slug)}
          className="group media-frame relative block aspect-editorial md:aspect-[4/5] xl:aspect-square"
        >
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="media-cover transition-transform duration-1000 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[rgb(0_0_0/0.45)] via-transparent via-40% to-transparent" />
          <div className="theme-inverse absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-gutter pb-8 text-center lg:pb-12">
            <h2 className="text-heading">{collection.title}</h2>
            <span className="text-label link-reveal group-hover:decoration-current">
              {collection.cta}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
