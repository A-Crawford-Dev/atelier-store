"use client";

import Image from "next/image";
import { useState } from "react";
import type { Img } from "@/lib/images";

/**
 * Mobile/tablet: full-width horizontal snap slider with a position counter.
 * Desktop: editorial stack — viewport-height lead image, details two-up beneath.
 */
export function ProductGallery({ images }: { images: Img[] }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative">
      <ul
        aria-label="Product images"
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:grid lg:grid-cols-2 lg:gap-px lg:overflow-visible"
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {images.map((image, i) => (
          <li
            key={image.src}
            className={`media-frame aspect-product w-full shrink-0 snap-start lg:w-auto ${
              // Lead image fills the first screen on desktop so the whole product is visible on load
              i === 0
                ? "lg:col-span-2 lg:aspect-auto lg:h-[calc(100svh-var(--header-h)-2.5rem)] lg:min-h-[32rem]"
                : ""
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload={i === 0}
              sizes={i === 0 ? "(min-width: 64rem) 60vw, 100vw" : "(min-width: 64rem) 30vw, 100vw"}
              className="media-cover"
            />
          </li>
        ))}
      </ul>

      {images.length > 1 && (
        <p
          aria-hidden="true"
          className="text-label absolute right-gutter bottom-4 bg-paper px-2 py-1 tabular-nums lg:hidden"
        >
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}
