import { Check } from "lucide-react";
import Icon from "@/components/Icon";
import type { Projet } from "@/types";

export default function ProjectCard({ projet, detail = false }: { projet: Projet; detail?: boolean }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-bg-alt text-primary-text">
        <Icon name={projet.icone} className="size-6" />
      </span>
      <h3 className="font-display text-2xl font-extrabold uppercase italic">{projet.nom}</h3>
      <p className="text-text-muted">{projet.resume}</p>
      {detail && (
        <ul className="space-y-2 text-sm">
          {projet.benefices.map((b) => (
            <li key={b} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
