import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { footerLinks } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="theme-inverse bg-paper">
      <div className="container-page section-y grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex max-w-md flex-col gap-6 lg:col-span-5">
          <h2 className="text-heading">Letters from the Atelier</h2>
          <p className="text-sm text-muted">
            New collections, private events and stories from our workshops, a few times a season.
          </p>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          {footerLinks.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-label mb-5">{group.title}</h3>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-reveal text-sm text-muted hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-2xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="tracking-label uppercase">United States · USD $</p>
          <p>© Atelier. Sample storefront for demonstration.</p>
        </div>
      </div>
    </footer>
  );
}
