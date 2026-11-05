"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/faq";

function FaqEntry({ item, baseId }: { item: FaqItem; baseId: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = `${baseId}-panel`;
  const buttonId = `${baseId}-button`;

  return (
    <div className="p-5">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 w-full items-center justify-between gap-4 text-left font-semibold"
        >
          {item.question}
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="inline-flex shrink-0 text-primary-text"
          >
            <ChevronDown className="size-5" />
          </motion.span>
        </button>
      </h3>
      {/* Le contenu reste dans le DOM (SEO) ; `inert` le retire du focus et des lecteurs d'écran tant qu'il est fermé. */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <p className="pt-3 text-text-muted">{item.reponse}</p>
      </motion.div>
    </div>
  );
}

/** Accordéon animé en hauteur (accessible : boutons, aria-expanded, région liée). */
export default function Faq({ items }: { items: FaqItem[] }) {
  const id = useId();
  return (
    <div className="max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((it, i) => (
        <FaqEntry key={it.question} item={it} baseId={`${id}-${i}`} />
      ))}
    </div>
  );
}
