"use client";

import { useState } from "react";
import { Star, MessageSquare, ExternalLink, Check } from "lucide-react";

export interface Agent {
  id: string;
  name?: string;
  description?: string;
  uri?: string;
  rating?: number;
  feedbackCount?: number;
  owner?: string;
  services?: string[];
  skills?: string[];
  isVerified?: boolean;
  isActive?: boolean;
}

interface AgentCardProps {
  agent: Agent;
  delay?: number;
}

export function AgentCard({ agent, delay = 0 }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const truncateAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative p-5 rounded-2xl
          bg-[var(--surface)] border border-[var(--surface-border)]
          transition-all duration-300
          ${isHovered 
            ? 'border-[var(--surface-border-hover)] shadow-[0_0_80px_var(--accent-glow)] -translate-y-0.5' 
            : ''
          }
        `}
      >
        {/* Status indicator - subtle */}
        {agent.isActive && (
          <div className="absolute top-4 right-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--foreground-subtle)] opacity-50"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--foreground-muted)]"></span>
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div 
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              bg-[var(--surface-hover)] border border-[var(--surface-border)]
              text-[var(--foreground-muted)] font-medium text-sm
              transition-all duration-300
              ${isHovered ? 'border-[var(--surface-border-hover)]' : ''}
            `}
          >
            {agent.name?.charAt(0)?.toUpperCase() || '#'}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-[var(--foreground)] truncate">
                {agent.name || `Agent #${agent.id}`}
              </h3>
              {agent.isVerified && (
                <Check className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
              )}
            </div>
            <p className="text-xs text-[var(--foreground-subtle)] font-mono">
              {agent.id}
            </p>
          </div>
        </div>

        {/* Description */}
        {agent.description && (
          <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2 leading-relaxed">
            {agent.description}
          </p>
        )}

        {/* Skills/Services - minimal tags */}
        {(agent.skills?.length || agent.services?.length) ? (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {[...(agent.services || []), ...(agent.skills || [])].slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="
                  px-2 py-0.5 text-xs rounded
                  text-[var(--foreground-subtle)]
                  border border-[var(--surface-border)]
                "
              >
                {tag}
              </span>
            ))}
            {(agent.skills?.length || 0) + (agent.services?.length || 0) > 4 && (
              <span className="px-2 py-0.5 text-xs text-[var(--foreground-subtle)]">
                +{(agent.skills?.length || 0) + (agent.services?.length || 0) - 4}
              </span>
            )}
          </div>
        ) : null}

        {/* Stats - subtle */}
        <div className="flex items-center gap-4 pt-4 border-t border-[var(--surface-border)]">
          {agent.rating !== undefined && (
            <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
              <Star className="w-3.5 h-3.5" />
              <span className="text-sm">{agent.rating.toFixed(1)}</span>
            </div>
          )}
          
          {agent.feedbackCount !== undefined && (
            <div className="flex items-center gap-1.5 text-[var(--foreground-subtle)]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-sm">{agent.feedbackCount}</span>
            </div>
          )}
          
          {agent.owner && (
            <span className="text-xs text-[var(--foreground-subtle)] font-mono ml-auto">
              {truncateAddress(agent.owner)}
            </span>
          )}
          
          {agent.uri && (
            <a
              href={agent.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-[var(--foreground-subtle)]
                hover:text-[var(--foreground-muted)]
                transition-colors duration-200
              "
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
