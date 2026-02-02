import { Star } from "lucide-react";
import type { FeedbackItem } from "@/lib/api";

interface FeedbackSectionProps {
  items: FeedbackItem[];
}

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const ts = Number(value);
  if (Number.isNaN(ts)) return value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(ts * 1000)
  );
};

const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export function FeedbackSection({ items }: FeedbackSectionProps) {
  const count = items.length;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
          Feedback ({count})
        </h2>
      </div>

      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]">
        {count === 0 ? (
          <div className="p-6 text-sm text-[var(--foreground-subtle)]">
            No feedback yet. Be the first to leave a rating.
          </div>
        ) : (
          <div className="divide-y divide-[var(--surface-border)]">
            {items.map((item) => (
              <div key={item.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1 text-[var(--foreground)]">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {item.comment && item.comment.trim().length > 0
                        ? `"${item.comment}"`
                        : "No comment"}
                    </p>
                    <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
                      {truncateAddress(item.sender)}
                      {item.createdAt ? ` · ${formatDate(item.createdAt)}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
