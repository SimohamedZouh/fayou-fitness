"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Défilement fluide (Lenis).
 * - Désactivé si prefers-reduced-motion (et réagit au changement de préférence).
 * - Désactivable avec NEXT_PUBLIC_SMOOTH_SCROLL=off.
 * - Mis en pause quand le tiroir ou le menu verrouillent le scroll (body overflow hidden).
 * - Les ancres (#devis, #sous-catégorie) restent gérées par le navigateur / Next,
 *   qui respectent scroll-margin (header collant) ; le focus n'est pas modifié.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SMOOTH_SCROLL === "off") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let observer: MutationObserver | null = null;
    let cancelled = false;

    const sync = () => {
      if (!lenis) return;
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };

    const start = async () => {
      if (lenis || mq.matches) return;
      const { default: LenisCtor } = await import("lenis");
      if (cancelled || lenis || mq.matches) return;
      lenis = new LenisCtor({ autoRaf: true, lerp: 0.12 });
      sync();
      observer = new MutationObserver(sync);
      observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    };

    const stop = () => {
      observer?.disconnect();
      observer = null;
      lenis?.destroy();
      lenis = null;
    };

    const onChange = () => {
      if (mq.matches) stop();
      else void start();
    };

    mq.addEventListener("change", onChange);
    void start();
    return () => {
      cancelled = true;
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}
