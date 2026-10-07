import Image from "next/image";
import Link from "next/link";
import { editorial } from "@/lib/catalog";

export function EditorialFeature() {
  return (
    <section className="bg-surface">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-editorial md:aspect-auto md:min-h-[40rem]">
          <Image
            src={editorial.image.src}
            alt={editorial.image.alt}
            fill
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="media-cover"
          />
        </div>
        <div className="flex items-center px-gutter py-16 md:py-section lg:px-16 xl:px-24">
          <div className="flex max-w-md flex-col items-start gap-6">
            <p className="text-label text-muted">{editorial.eyebrow}</p>
            <h2 className="font-serif text-4xl leading-[1.05] lg:text-[3.5rem]">
              {editorial.title}
            </h2>
            <p className="text-base text-muted">{editorial.body}</p>
            <Link href={editorial.cta.href} className="btn btn-secondary mt-2">
              {editorial.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
