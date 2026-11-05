import clsx from "clsx";
import Reveal from "@/components/Reveal";

export function SectionTitle({
  children,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={clsx(
        "font-display text-3xl font-extrabold uppercase italic leading-tight tracking-tight sm:text-4xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default function Section({
  id,
  title,
  intro,
  alt = false,
  children,
}: {
  id?: string;
  title: string;
  intro?: string;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={clsx("py-16 sm:py-20", alt && "bg-bg-alt")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 max-w-2xl space-y-3">
          <SectionTitle>{title}</SectionTitle>
          {intro && <p className="text-text-muted">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
