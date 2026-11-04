import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold uppercase italic text-primary-text">
        404
      </p>
      <h1 className="font-display text-3xl font-extrabold uppercase italic sm:text-4xl">
        Page introuvable
      </h1>
      <p className="text-text-muted">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center rounded-full bg-primary px-6 font-bold text-white"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
