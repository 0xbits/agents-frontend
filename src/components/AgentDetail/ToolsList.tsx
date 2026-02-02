interface ToolsListProps {
  title: string;
  items?: string[] | null;
}

export function ToolsList({ title, items }: ToolsListProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
        {title} ({items.length})
      </h2>
      <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground-subtle)]" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
