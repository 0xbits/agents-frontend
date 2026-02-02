import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface CapabilityCardProps {
  title: string;
  count: number;
  href: string;
  icon?: LucideIcon;
  description?: string;
}

export function CapabilityCard({ title, count, href, icon, description }: CapabilityCardProps) {
  const Icon = icon;

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--surface-border-hover)] hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        {Icon ? <Icon className="h-4 w-4 text-[var(--foreground-muted)]" aria-hidden /> : null}
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </h3>
      </div>
      {description && (
        <p className="mt-2 text-sm text-[var(--foreground-subtle)]">
          {description}
        </p>
      )}
      <p className="mt-4 text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
        {count.toLocaleString()} agents
      </p>
    </Link>
  );
}
