import type { ReactNode } from "react";

const VARIANTS: Record<string, string> = {
  default: "border-[var(--surface-border)] text-[var(--foreground-subtle)]",
  muted: "border-[var(--surface-border)] text-[var(--foreground-muted)]",
  blue: "border-blue-500/30 text-blue-300 bg-blue-500/10",
  purple: "border-purple-500/30 text-purple-300 bg-purple-500/10",
  green: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
  amber: "border-amber-500/30 text-amber-200 bg-amber-500/10",
};

interface BadgeProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
        VARIANTS[variant]
      } ${className}`}
    >
      {children}
    </span>
  );
}
