import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getWalletProfile } from "@/lib/api";
import { ExternalLink, User, Star, MessageSquare, Wallet } from "lucide-react";

interface PageProps {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  return {
    title: `${shortAddr} | Agent Registry`,
    description: `View agents owned and endorsed by ${shortAddr}`,
  };
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getInterfaceUrl(address: string) {
  return `https://app.interface.social/${address}`;
}

function getEtherscanUrl(address: string) {
  return `https://etherscan.io/address/${address}`;
}

export default async function WalletProfilePage({ params }: PageProps) {
  const { address } = await params;
  
  // Validate address format
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    notFound();
  }

  let profile;
  try {
    profile = await getWalletProfile(address);
  } catch {
    notFound();
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] font-mono">
                {truncateAddress(address)}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <a
                  href={getInterfaceUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] inline-flex items-center gap-1"
                >
                  Interface <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={getEtherscanUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] inline-flex items-center gap-1"
                >
                  Etherscan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <span className="text-sm text-[var(--foreground-muted)]">
                <strong>{profile.stats.agentsOwned}</strong> agents owned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <span className="text-sm text-[var(--foreground-muted)]">
                <strong>{profile.stats.agentsEndorsed}</strong> agents endorsed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--foreground-subtle)]" />
              <span className="text-sm text-[var(--foreground-muted)]">
                <strong>{profile.stats.feedbackGiven}</strong> reviews given
              </span>
            </div>
          </div>
        </div>

        {/* Endorsed Agents */}
        {profile.endorsed.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
              Endorsed Agents
            </h2>
            <p className="text-xs text-[var(--foreground-subtle)] mb-4">
              Agents rated 70+ by this wallet
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.endorsed.map((agent) => (
                <Link
                  key={agent.agentId}
                  href={`/agents/${agent.agentId}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--surface-border-hover)] transition-colors"
                >
                  {agent.agentImage ? (
                    <Image
                      src={agent.agentImage}
                      alt={agent.agentName || "Agent"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {(agent.agentName || "A")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--foreground)] truncate">
                      {agent.agentName || `Agent #${agent.agentId}`}
                    </h3>
                    <p className="text-sm text-[var(--foreground-subtle)]">
                      Rated {Math.round(agent.rating)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Owned Agents */}
        {profile.owned.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
              Owned Agents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.owned.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--surface-border-hover)] transition-colors"
                >
                  {agent.image ? (
                    <Image
                      src={agent.image}
                      alt={agent.name || "Agent"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      {(agent.name || "A")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--foreground)] truncate">
                      {agent.name || `Agent #${agent.id}`}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-[var(--foreground-subtle)]">
                      {agent.avgRating != null && (
                        <span>{Math.round(agent.avgRating)} rating</span>
                      )}
                      <span>{agent.feedbackCount || 0} reviews</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Feedback History */}
        {profile.feedbackGiven.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
              Feedback History
            </h2>
            <div className="space-y-3">
              {profile.feedbackGiven.map((feedback, index) => (
                <div
                  key={`${feedback.agentId}-${index}`}
                  className="p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/agents/${feedback.agentId}`}
                      className="font-medium text-[var(--foreground)] hover:text-[var(--foreground-muted)]"
                    >
                      {feedback.agentName || `Agent #${feedback.agentId}`}
                    </Link>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[var(--foreground-muted)]">
                        {Math.round(feedback.rating)}
                      </span>
                      <span className="text-[var(--foreground-subtle)]">
                        {formatDate(feedback.createdAt)}
                      </span>
                    </div>
                  </div>
                  {feedback.comment && (
                    <p className="text-sm text-[var(--foreground-subtle)] whitespace-pre-wrap">
                      {feedback.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {profile.owned.length === 0 && profile.endorsed.length === 0 && profile.feedbackGiven.length === 0 && (
          <div className="text-center py-16">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-subtle)] opacity-40" />
            <p className="text-[var(--foreground-subtle)]">
              This wallet has no agent activity yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
