import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/faq";

/** Accordéon simple basé sur <details> (accessible, sans JavaScript). */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((it) => (
        <details key={it.question} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {it.question}
            <ChevronDown
              className="size-5 shrink-0 text-primary-text transition-transform group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-text-muted">{it.reponse}</p>
        </details>
      ))}
    </div>
  );
}
