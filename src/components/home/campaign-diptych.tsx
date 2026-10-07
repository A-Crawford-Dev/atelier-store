import Image from "next/image";
import Link from "next/link";
import { campaign } from "@/lib/catalog";

export function CampaignDiptych() {
  return (
    <section className="relative">
      {/* One full-width image on mobile, both side by side from md */}
      <div className="grid gap-px md:grid-cols-2">
        {campaign.images.map((image, i) => (
          <div
            key={image.src}
            className={`media-frame relative aspect-editorial md:aspect-[4/5] xl:aspect-square ${i > 0 ? "hidden md:block" : ""}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 48rem) 50vw, 100vw"
              className={`media-cover ${i === 1 ? "object-[50%_30%]" : ""}`}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-[rgb(0_0_0/0.5)] via-transparent via-50% to-transparent" />
      <div className="theme-inverse absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-gutter pb-8 text-center lg:pb-16">
        <p className="text-label">{campaign.eyebrow}</p>
        <h2 className="text-display">{campaign.title}</h2>
        <Link href={campaign.cta.href} className="btn btn-primary mt-2">
          {campaign.cta.label}
        </Link>
      </div>
    </section>
  );
}
