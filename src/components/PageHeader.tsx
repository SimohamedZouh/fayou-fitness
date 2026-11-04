import { SectionTitle } from "@/components/Section";

/** En-tête de page intérieure : contient l'unique h1. */
export default function PageHeader({
  titre,
  intro,
  children,
}: {
  titre: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border bg-bg-alt">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-12 sm:px-6 sm:py-16">
        {children}
        <SectionTitle as="h1" className="text-4xl sm:text-5xl">
          {titre}
        </SectionTitle>
        {intro && <p className="max-w-2xl text-text-muted">{intro}</p>}
      </div>
    </header>
  );
}
