/**
 * Bordure violette lumineuse au survol / focus : seule l'opacité est animée.
 * À placer dans un parent `group relative`, avant la carte.
 */
export default function CardGlow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-primary shadow-[0_14px_36px_-10px_rgba(127,0,251,0.6)] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
    />
  );
}
