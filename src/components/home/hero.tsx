import Image from "next/image";
import Link from "next/link";
import { hero } from "@/lib/catalog";

export function Hero() {
  return (
    // Fills the first screen below the announcement bar and header, within sane bounds
    <section className="relative h-[calc(100svh-var(--header-h)-2.5rem)] max-h-[60rem] min-h-[34rem] w-full overflow-hidden bg-surface">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        preload
        sizes="100vw"
        className="media-cover object-[58%_center]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[rgb(0_0_0/0.6)] via-[rgb(0_0_0/0.1)] via-45% to-transparent" />
      <div className="absolute inset-0 hidden bg-linear-to-r from-[rgb(0_0_0/0.3)] via-transparent via-45% to-transparent lg:block" />

      <div className="theme-inverse absolute inset-x-0 bottom-0">
        <div className="container-page flex flex-col items-start gap-5 pb-10 lg:pb-16">
          <p className="text-label">{hero.eyebrow}</p>
          <h1 className="text-display max-w-[12ch]">{hero.title}</h1>
          <p className="max-w-md text-base">{hero.body}</p>
          <div className="mt-2 grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
            {hero.actions.map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                className={`btn px-4 sm:px-8 ${i === 0 ? "btn-primary" : "btn-secondary"}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
