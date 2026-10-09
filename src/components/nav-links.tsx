"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

type NavItem = { label: string; href: string };

type Props = {
  items: NavItem[];
  itemClassName?: string;
  linkClassName?: string;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItems({ items, itemClassName, linkClassName, current }: Props & { current?: string }) {
  return items.map((item) => (
    <li key={item.href} className={itemClassName}>
      <Link
        href={item.href}
        aria-current={item.href === current ? "page" : undefined}
        className={linkClassName}
      >
        {item.label}
      </Link>
    </li>
  ));
}

function ActiveNavItems(props: Props) {
  const pathname = usePathname();
  const current = props.items.find((item) => isActive(pathname, item.href))?.href;
  return <NavItems {...props} current={current} />;
}

/**
 * `<li>` nav links that mark the section being viewed with aria-current="page"
 * (styled by `link-reveal`). usePathname suspends while prerendering routes
 * with unknown params, so the fallback renders the same links unhighlighted.
 */
export function NavLinks(props: Props) {
  return (
    <Suspense fallback={<NavItems {...props} />}>
      <ActiveNavItems {...props} />
    </Suspense>
  );
}
