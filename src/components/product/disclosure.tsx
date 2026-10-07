import type { ReactNode } from "react";

/** Native <details> accordion row with hairline dividers and a +/− marker */
export function Disclosure({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
        <span className="text-label">{title}</span>
        <span aria-hidden="true" className="relative size-3">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink" />
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink transition-transform duration-300 group-open:scale-y-0" />
        </span>
      </summary>
      <div className="pb-6 text-sm text-muted">{children}</div>
    </details>
  );
}
