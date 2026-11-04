import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-text-muted">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.label} className="flex items-center gap-1">
              {it.href && !last ? (
                <Link href={it.href} className="hover:text-primary-text hover:underline">
                  {it.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "font-semibold text-text" : undefined}
                >
                  {it.label}
                </span>
              )}
              {!last && <ChevronRight className="size-4" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
