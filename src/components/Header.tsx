"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollProgress from "@/components/ScrollProgress";
import { devisHref, navLinks } from "@/data/navigation";
import { useQuoteStore } from "@/lib/quote-store";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const hydrated = useQuoteStore((st) => st.hydrated);
  const rawCount = useQuoteStore((st) => st.items.reduce((t, i) => t + i.quantite, 0));
  const openDrawer = useQuoteStore((st) => st.openDrawer);
  // 0 tant que le localStorage n'est pas relu : même rendu serveur / client.
  const quoteCount = hydrated ? rawCount : 0;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = [
        toggleRef.current,
        ...Array.from(
          overlayRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
        ),
      ].filter((n): n is HTMLElement => !!n);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <header
        className={clsx(
          "sticky top-0 z-50 w-full border-b transition-[padding,background-color,border-color,backdrop-filter] duration-300 motion-reduce:transition-none",
          scrolled
            ? "border-border bg-bg/80 py-1 backdrop-blur-lg"
            : "border-transparent bg-bg py-3",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6">
          <Link
            href="/"
            aria-label="FAYOU Fitness : accueil"
            className={clsx(
              "block shrink-0 transition-[width] duration-300 motion-reduce:transition-none",
              scrolled ? "w-20 sm:w-24" : "w-24 sm:w-32",
            )}
          >
            <Logo priority sizes="128px" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "relative block px-3 py-2 text-sm font-semibold transition-colors",
                        active ? "text-primary-text" : "text-text hover:text-primary-text",
                      )}
                    >
                      {l.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openDrawer}
              aria-haspopup="dialog"
              aria-label={`Ma demande de devis : ${quoteCount} machine${quoteCount > 1 ? "s" : ""}`}
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-text transition-colors hover:border-primary-text hover:text-primary-text"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              <motion.span
                key={quoteCount}
                aria-hidden="true"
                initial={quoteCount > 0 ? { scale: 1.6 } : false}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-5 text-white"
              >
                {quoteCount}
              </motion.span>
            </button>
            <ThemeToggle />
            <Link
              href={devisHref}
              className="hidden h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-white transition-transform hover:scale-105 motion-reduce:hover:scale-100 sm:inline-flex"
            >
              Devis gratuit
            </Link>
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => (open ? close() : setOpen(true))}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-text lg:hidden"
            >
              {open ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-bg px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 lg:hidden"
          >
            <motion.ul
              variants={list}
              initial="hidden"
              animate="show"
              className="mx-auto flex max-w-md flex-col gap-2"
            >
              {navLinks.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <motion.li key={l.href} variants={item}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "block border-b border-border py-3 font-display text-4xl font-extrabold uppercase italic tracking-tight",
                        active ? "text-primary-text" : "text-text",
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li variants={item} className="pt-6">
                <Link
                  href={devisHref}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center justify-center rounded-full bg-primary text-base font-bold text-white"
                >
                  Devis gratuit
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
