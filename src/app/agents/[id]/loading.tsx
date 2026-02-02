export default function Loading() {
  return (
    <div className="min-h-screen">
      <main className="pt-20 pb-24">
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="h-6 w-40 rounded-full animate-shimmer mb-8" />
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="h-20 w-20 rounded-2xl animate-shimmer" />
              <div className="flex-1 space-y-4">
                <div className="h-10 w-2/3 rounded-full animate-shimmer" />
                <div className="h-4 w-24 rounded-full animate-shimmer" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-full animate-shimmer" />
                  <div className="h-4 w-5/6 rounded-full animate-shimmer" />
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              <div className="h-7 w-16 rounded-full animate-shimmer" />
              <div className="h-7 w-16 rounded-full animate-shimmer" />
              <div className="h-7 w-16 rounded-full animate-shimmer" />
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="h-40 rounded-2xl animate-shimmer" />
              <div className="h-40 rounded-2xl animate-shimmer" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
