"use client";

import Link from "next/link";
import { useRef } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { NavLinks } from "@/components/nav-links";

type NavItem = { label: string; href: string };

export function MobileMenu({ items }: { items: NavItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="btn-icon -ml-3 lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper text-ink backdrop:bg-transparent open:flex open:flex-col lg:hidden"
        onClick={(e) => {
          // Close when a link inside is followed
          if ((e.target as HTMLElement).closest("a")) close();
        }}
      >
        <div className="container-page flex h-header shrink-0 items-center border-b border-line">
          <button
            type="button"
            className="btn-icon -ml-3"
            aria-label="Close menu"
            onClick={close}
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile" className="container-page flex-1 overflow-y-auto py-6">
          <ul>
            <NavLinks
              items={items}
              itemClassName="border-b border-line"
              linkClassName="link-reveal block py-4 text-xl"
            />
          </ul>
          <div className="mt-8 flex flex-col gap-4">
            <Link href="/account" className="text-label link-reveal">
              My Account
            </Link>
            <Link href="/contact" className="text-label link-reveal">
              Contact Us
            </Link>
          </div>
        </nav>
      </dialog>
    </>
  );
}
