import type { AgentService } from "@/lib/api";

interface ServicesSectionProps {
  services?: AgentService[] | null;
}

const isPresent = (value?: string | null) => value && value.trim().length > 0;

export function ServicesSection({ services }: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
        Services
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={`${service.name}-${index}`}
            className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {service.name}
              </h3>
              {isPresent(service.version) && (
                <span className="text-xs text-[var(--foreground-subtle)]">{service.version}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-[var(--foreground-muted)] break-words">
              {service.endpoint}
            </p>
            {isPresent(service.description) && (
              <p className="mt-3 text-sm text-[var(--foreground-subtle)] leading-relaxed">
                {service.description}
              </p>
            )}

            {service.tools && service.tools.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider mb-2">
                  Tools
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--foreground-subtle)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {service.skills && service.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--foreground-subtle)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
