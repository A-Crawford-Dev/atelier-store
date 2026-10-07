import Link from "next/link";
import { BagIcon, SearchIcon, UserIcon } from "@/components/icons";
import { MobileMenu } from "@/components/mobile-menu";
import { navigation } from "@/lib/catalog";

export function SiteHeader() {
  return (
    <>
      <div className="theme-inverse bg-paper">
        <p className="container-page py-2.5 text-center text-2xs tracking-label uppercase">
          Complimentary shipping and returns
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="container-page grid h-header grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center">
            <MobileMenu items={navigation} />
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex gap-6 xl:gap-8">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-label link-reveal">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.32em] uppercase lg:text-3xl"
            aria-label="Atelier, home"
          >
            Atelier
          </Link>

          <div className="-mr-3 flex items-center justify-end">
            <Link href="/search" className="btn-icon" aria-label="Search">
              <SearchIcon />
            </Link>
            <Link href="/account" className="btn-icon hidden sm:inline-flex" aria-label="Account">
              <UserIcon />
            </Link>
            <Link href="/bag" className="btn-icon" aria-label="Shopping bag, 0 items">
              <BagIcon />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
