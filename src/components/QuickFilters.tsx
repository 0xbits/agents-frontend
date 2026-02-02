"use client";

interface FilterOption {
  label: string;
  type: "mcp" | "a2a" | "x402" | "tag";
  value: string;
}

interface QuickFiltersProps {
  options: FilterOption[];
  activeFilter: { type: string; value: string } | null;
  onToggle: (filter: FilterOption) => void;
}

export function QuickFilters({ options, activeFilter, onToggle }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      {options.map((option) => {
        const isActive =
          activeFilter?.type === option.type && activeFilter?.value === option.value;

        return (
          <button
            key={`${option.type}-${option.value}`}
            type="button"
            onClick={() => onToggle(option)}
            className={`
              rounded-full border px-4 py-2 text-xs uppercase tracking-wider
              transition-colors duration-200
              ${
                isActive
                  ? "border-[var(--surface-border-hover)] text-[var(--foreground)]"
                  : "border-[var(--surface-border)] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
