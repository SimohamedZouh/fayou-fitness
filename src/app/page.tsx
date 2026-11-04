import Logo from "@/components/Logo";

// Page temporaire (étape 1) : sert à vérifier thème, polices et logo.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="w-full max-w-md">
        <Logo priority />
      </div>
      <h1 className="font-display text-4xl font-extrabold italic uppercase tracking-tight text-primary-text sm:text-6xl">
        Qualité. Performance. Confiance.
      </h1>
      <p className="max-w-prose text-text-muted">
        Matériel de sport neuf et d&apos;occasion, depuis 2006.
      </p>
    </div>
  );
}
