export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-medium text-[var(--foreground)]">Agent not found</h1>
        <p className="mt-3 text-sm text-[var(--foreground-subtle)]">
          This agent does not exist or is unavailable.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center mt-6 rounded-full border border-[var(--surface-border)] px-4 py-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--surface-border-hover)] transition-colors"
        >
          Back to homepage
        </a>
      </div>
    </div>
  );
}
