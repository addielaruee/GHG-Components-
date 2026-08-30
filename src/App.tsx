/**
 * Component gallery.
 *
 * This repo holds the P24 dashboard's React components, built and reviewed in
 * isolation before they are assembled into screens. This page is where they get
 * rendered so they can be looked at.
 *
 * Add a <section> per component as it lands.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-8 py-5">
        <h1 className="text-lg font-semibold">GHG Components</h1>
        <p className="mt-1 text-sm text-gray-500">
          P24 — GHG chamber monitoring dashboard. Component gallery.
        </p>
      </header>

      <main className="p-8">
        <p className="text-sm text-gray-500">
          No components yet. See{' '}
          <code className="rounded bg-gray-200 px-1 py-0.5 text-xs">COMPONENT_INVENTORY.md</code> in
          the project folder for what to build and in what order.
        </p>

        {/* Confirms Tailwind and the design tokens from index.css are wired up. */}
        <div className="mt-6 flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-status-ok" />
          <span className="size-2.5 rounded-full bg-status-warn" />
          <span className="size-2.5 rounded-full bg-status-error" />
          <span className="size-2.5 rounded-full bg-status-unknown" />
          <span className="ml-2 text-xs text-gray-400">status tokens</span>
        </div>
      </main>
    </div>
  )
}
