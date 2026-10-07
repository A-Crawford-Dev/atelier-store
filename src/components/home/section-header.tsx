import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  link?: { label: string; href: string };
};

export function SectionHeader({ eyebrow, title, link }: Props) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 lg:mb-12">
      <div className="flex flex-col gap-3">
        {eyebrow && <p className="text-label text-muted">{eyebrow}</p>}
        <h2 className="text-heading">{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className="text-label link shrink-0">
          {link.label}
        </Link>
      )}
    </div>
  );
}
