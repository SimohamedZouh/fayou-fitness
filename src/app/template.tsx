/**
 * Transition entre pages : fondu court en CSS (opacity uniquement, désactivé si mouvement réduit).
 * Un template est recréé à chaque navigation, ce qui relance l'animation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition flex flex-1 flex-col">{children}</div>;
}
