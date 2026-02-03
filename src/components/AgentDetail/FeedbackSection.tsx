"use client";

import { useMemo, useState } from "react";
import { ExternalLink, MessageSquare } from "lucide-react";
import type { FeedbackItem } from "@/lib/api";

interface FeedbackSectionProps {
  items: FeedbackItem[];
  avgRating?: number | null;
  agentId?: string;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(Number(dateStr) * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const getInterfaceUrl = (address: string) =>
  `https://app.interface.social/${address}`;

const reputationRegistryUrl =
  "https://etherscan.io/address/0x8004BAa17C55a88189AE136b182e5fdA19dE9b63#writeContract";

export function FeedbackSection({
  items,
  avgRating,
  agentId,
}: FeedbackSectionProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const validItems = useMemo(
    () => items.filter((item) => !item.isRevoked),
    [items]
  );

  const filters = useMemo(
    () => [
      { key: "90plus", label: "90+", min: 90, max: 100 },
      { key: "70-89", label: "70-89", min: 70, max: 89 },
      { key: "50-69", label: "50-69", min: 50, max: 69 },
      { key: "<50", label: "<50", min: 0, max: 49 },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    if (filter === null) return validItems;
    const range = filters.find((entry) => entry.key === filter);
    if (!range) return validItems;
    return validItems.filter((item) => {
      const score = Math.round(item.rating);
      return score >= range.min && score <= range.max;
    });
  }, [validItems, filter, filters]);

  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);
  const hasMore = filteredItems.length > 5;

  const ratingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filters.forEach((range) => {
      counts[range.key] = 0;
    });
    validItems.forEach((item) => {
      const score = Math.round(item.rating);
      const match = filters.find(
        (range) => score >= range.min && score <= range.max
      );
      if (match) counts[match.key] += 1;
    });
    return counts;
  }, [validItems, filters]);

  const computedAvg = useMemo(() => {
    if (avgRating != null) return avgRating;
    if (validItems.length === 0) return null;
    const total = validItems.reduce((sum, item) => sum + item.rating, 0);
    return total / validItems.length;
  }, [avgRating, validItems]);

  const feedbackUrl = agentId
    ? `${reputationRegistryUrl}?agentId=${encodeURIComponent(agentId)}`
    : reputationRegistryUrl;

  return (
    <section className="mt-10">
      <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
        Reputation
      </h2>

      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <span className="text-lg font-semibold text-[var(--foreground)]">
              {computedAvg != null ? Math.round(computedAvg) : "—"}
            </span>
            <span className="text-sm text-[var(--foreground-subtle)] ml-1">
              average
            </span>
          </div>
          <span className="text-sm text-[var(--foreground-subtle)]">
            • {validItems.length} {validItems.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {validItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[var(--foreground-subtle)]">
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setFilter(null)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filter === null
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--background)] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
              }`}
            >
              All ({validItems.length})
            </button>
            {filters.map((range) => (
              <button
                key={range.key}
                type="button"
                onClick={() =>
                  setFilter((current) => (current === range.key ? null : range.key))
                }
                disabled={ratingCounts[range.key] === 0}
                className={`px-3 py-1 rounded-full text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  filter === range.key
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--background)] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
                }`}
              >
                {range.label} ({ratingCounts[range.key]})
              </button>
            ))}
          </div>
        )}

        {displayItems.length > 0 ? (
          <div className="space-y-3">
            {displayItems.map((item, index) => (
              <div
                key={`${item.client}-${index}`}
                className="p-4 rounded-xl bg-[var(--background)] border border-[var(--surface-border)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--foreground-subtle)]">
                      {Math.round(item.rating)}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--foreground-subtle)]">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                {item.comment && (
                  <p className="text-sm text-[var(--foreground-muted)] mb-3 whitespace-pre-wrap">
                    {item.comment}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags.filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-[var(--surface)] text-xs text-[var(--foreground-subtle)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <a
                    href={getInterfaceUrl(item.client)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] font-mono inline-flex items-center gap-1 ml-auto"
                  >
                    {truncateAddress(item.client)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[var(--foreground-subtle)]">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No feedback yet</p>
          </div>
        )}

        {hasMore && !showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-4 text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
          >
            Show all {filteredItems.length} reviews
          </button>
        )}

        <div className="mt-6 pt-6 border-t border-[var(--surface-border)]">
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            Leave Feedback
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
            Submit feedback on-chain via the ReputationRegistry contract
          </p>
        </div>
      </div>
    </section>
  );
}
