import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "outline" | "white" | "ghost-white";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:brightness-110",
  outline: "border-2 border-primary text-primary-text hover:bg-primary hover:text-white",
  white: "bg-white text-[#7f00fb] hover:bg-bg-alt",
  "ghost-white": "border-2 border-white text-white hover:bg-white hover:text-[#7f00fb]",
};

export default function ButtonLink({
  href,
  variant = "primary",
  external = false,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = clsx(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold uppercase tracking-wide transition-colors",
    variants[variant],
    className,
  );
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
