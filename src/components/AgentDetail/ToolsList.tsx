interface ToolsListProps {
  title: string;
  items?: string[] | null;
}

export function ToolsList({ title, items }: ToolsListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--surface-border)]"
          >
            <code className="text-sm font-mono text-[var(--foreground-muted)]">
              {item}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
