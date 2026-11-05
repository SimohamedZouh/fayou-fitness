import Icon from "@/components/Icon";
import MarqueeTrack from "@/components/MarqueeTrack";
import type { IconName } from "@/types";

export interface MarqueeItem {
  label: string;
  icone: IconName;
}

/** Bandeau défilant des catégories : ralentit au survol, statique si mouvement réduit. */
export default function Marquee({ items }: { items: MarqueeItem[] }) {
  const liste = (copie: boolean) => (
    <ul
      className={
        copie
          ? "flex shrink-0 items-center gap-10 pr-10 motion-reduce:hidden"
          : "flex shrink-0 items-center gap-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 motion-reduce:gap-y-3 motion-reduce:pr-0"
      }
      aria-hidden={copie || undefined}
    >
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
    <div className="bg-primary py-4">
      <MarqueeTrack>
        {liste(false)}
        {liste(true)}
      </MarqueeTrack>
    </div>
  );
}
