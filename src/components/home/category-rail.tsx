import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/home/section-header";
import { getCategories } from "@/lib/categories";

export async function CategoryRail() {
  const categories = await getCategories();

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeader eyebrow="Explore" title="Shop by Category" />
      </div>
      <ul className="rail mx-auto max-w-page lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/${category.slug}`} className="group block">
              <div className="media-frame aspect-editorial">
                <Image
                  src={category.image.src}
                  alt={category.image.alt}
                  fill
                  sizes="(min-width: 64rem) 17vw, (min-width: 48rem) 40vw, 70vw"
                  className="media-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-label link-reveal mt-4 inline-block group-hover:decoration-current">
                {category.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
