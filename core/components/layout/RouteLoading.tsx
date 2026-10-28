export function RouteLoading({ title = "A carregar" }: { title?: string }) {
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-200" aria-label={title} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-white p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-7 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-white p-5">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
