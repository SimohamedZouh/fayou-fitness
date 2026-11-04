import { Check } from "lucide-react";
import Icon from "@/components/Icon";
import type { Service } from "@/types";

export default function ServiceCard({ service, detail = false }: { service: Service; detail?: boolean }) {
  return (
    <article
      id={service.slug}
      className="flex h-full scroll-mt-24 flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-white">
        <Icon name={service.icone} className="size-6" />
      </span>
      <h3 className="font-display text-2xl font-extrabold uppercase italic">{service.nom}</h3>
      <p className="text-text-muted">{service.resume}</p>
      {detail && (
        <ul className="space-y-2 text-sm">
          {service.points.map((p) => (
            <li key={p} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
