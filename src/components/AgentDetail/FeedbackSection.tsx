import { Star, ExternalLink } from "lucide-react";
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

const getInterfaceUrl = (address: string) =>
  `https://app.interface.social/${address}`;

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
            {items.map((item, index) => (
              <div key={`${item.client}-${index}`} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1 text-[var(--foreground)]">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <div className="flex-1">
                    {item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded border border-[var(--surface-border)] text-[var(--foreground-subtle)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--foreground-muted)]">
                        No comment
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
                      <a
                        href={getInterfaceUrl(item.client)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono hover:text-[var(--foreground-muted)] transition-colors"
                      >
                        {truncateAddress(item.client)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {item.createdAt && (
                        <>
                          <span>·</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </>
                      )}
                    </div>
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
