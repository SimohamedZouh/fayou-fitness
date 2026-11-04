"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Contrast } from "lucide-react";

/**
 * Bascule clair / sombre. Le label est statique et l'état n'est lu qu'au clic :
 * aucun risque de décalage d'hydratation.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [turns, setTurns] = useState(0);

  return (
    <button
      type="button"
      aria-label="Basculer entre le thème clair et le thème sombre"
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        setTurns((t) => t + 1);
      }}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-text transition-colors hover:border-primary-text hover:text-primary-text"
    >
      <motion.span
        animate={{ rotate: turns * 180 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="inline-flex"
      >
        <Contrast className="size-5" aria-hidden="true" />
      </motion.span>
    </button>
  );
}
