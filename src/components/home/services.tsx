import Link from "next/link";
import { services } from "@/lib/catalog";

export function Services() {
  return (
    <section aria-label="Client services" className="container-page section-y">
      <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <li key={service.title} className="border-t border-line pt-6 pb-10">
            <Link href={service.href} className="group flex h-full flex-col gap-3">
              <h3 className="text-label">{service.title}</h3>
              <p className="text-sm text-muted">{service.body}</p>
              <span className="text-label link-reveal mt-auto pt-2 group-hover:decoration-current">
                Learn More
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
