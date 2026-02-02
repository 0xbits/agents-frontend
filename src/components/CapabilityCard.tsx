import Link from "next/link";

interface CapabilityCardProps {
  title: string;
  count: number;
  href: string;
  icon?: string;
  description?: string;
}

export function CapabilityCard({ title, count, href, icon, description }: CapabilityCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--surface-border-hover)] hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-xl" aria-hidden>
            {icon}
          </span>
        )}
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
