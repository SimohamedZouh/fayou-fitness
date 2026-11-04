import Icon from "@/components/Icon";
import type { IconName } from "@/types";

export interface MarqueeItem {
  label: string;
  icone: IconName;
}

/** Bandeau défilant simple (CSS), arrêté si prefers-reduced-motion. */
export default function Marquee({ items }: { items: MarqueeItem[] }) {
  const liste = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-center gap-3 whitespace-nowrap font-display text-xl font-extrabold uppercase italic text-white"
        >
          <Icon name={it.icone} className="size-6" />
          {it.label}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden bg-primary py-4">
      <div className="marquee-track flex w-max">
        {liste(false)}
        {liste(true)}
      </div>
    </div>
  );
}
