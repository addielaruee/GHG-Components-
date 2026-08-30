# GHG Components

React components for **P24: Online Platform to Manage and Monitor GHG Systems**, the SOFT3888
capstone project for USYD SOLES.

These are built and reviewed **in isolation** here, then copied across to the group repository.

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Lint | oxlint |

Tailwind 4 is configured **in CSS**, not a JS config file. Design tokens live in the `@theme` block
in `src/index.css`. There is no `tailwind.config.js`.

## Getting started

```bash
npm install
npm run dev        # component gallery at http://localhost:5173
npm run build      # typecheck + production build
npm run lint       # oxlint
npm run typecheck  # types only
npm run check:size # 300-line limit on components (also runs in CI)
```

## What works, and what is not wired yet

This repo is a **component library, not the application**. Everything is built and reviewed in
isolation in the gallery (`npm run dev`). That is deliberate, but it means parts of the gallery look
inert when they are actually fine, so here is the honest split.

### Works, in isolation

Every component in `src/components/` is functional on its own: state changes, keyboard navigation,
focus rings, ARIA. Specifically worth knowing, because these look passive but are not:

- **SegmentedControl** does change state and move its pill. Nothing visibly happens downstream
  because the screens it would switch between do not exist yet.
- **Checkbox** drives a real indeterminate select-all.
- **Select** opens a real listbox with full keyboard support.
- **AppShell** scrolls only its content column; sidebar and header hold position.

### Not wired, on purpose

| Thing | Why | Unblocked by |
|---|---|---|
| The Cards / Table / Map toggle changes nothing | Those three screens are separate components | Tier 3 (`DataTable`, `DeviceCard`, `AnalyserCard`) and Tier 6 (`MapCanvas`) |
| No navigation between sections | There is no router, and routing was never specified in the W3 proposal | A team decision, see below |
| No real data anywhere | Mocks exist in `src/mocks/`, but nothing fetches | The backend API contract |
| `DemoSidebar` in `App.tsx` | A gallery stand-in so AppShell can be seen. It is **not** the real component | `SidebarNav`, next in the inventory |

### TODO before this becomes an app

- [ ] **Decide routing.** Nothing in the proposal says how navigation works. React Router is the
      obvious default, but nobody has picked it and nobody owns it.
- [ ] **Agree the API contract** with whoever builds the Python backend, so the frontend can be
      written against a typed mock instead of waiting.
- [x] ~~**Build a mock data layer**~~ Done. `src/types/` and `src/mocks/`, taken from the client's
      real sample files. The fleet deliberately carries the awkward cases: the array skips position
      5, one array chamber has gone quiet with stale readings still on file, one standalone chamber
      is unreachable with no reading at all, and one has never produced a flux.
- [ ] **Decide who assembles screens** from these components. The Week 8 client deployment needs a
      running application, not a component set, and that step currently has no owner.
- [ ] Replace `DemoSidebar` with the real `SidebarNav` once it lands.

## Layout

```
src/
├── components/
│   ├── primitives/   Button, SegmentedControl, StatusDot, Badge, Chip, inputs…
│   ├── layout/       AppShell, SidebarNav, PageHeader, Breadcrumb, DetailHeader
│   ├── data/         DataTable, StatStrip, DeviceCard, AnalyserCard, LegendPanel…
│   ├── charts/       TimeSeriesChart and its wrappers
│   └── overlays/     Modal, Popover, ColourPicker, LineStylePicker
├── types/            Domain types. Array and standalone chambers are a
│                     discriminated union, since they report different fields.
│                     Every sensor value is `number | null`, never optional and
│                     never 0.
├── lib/              Shared helpers
├── mocks/            A fleet and time series shaped like the client's real
│                     data, awkward cases included
└── App.tsx           The component gallery
```

## Design language

The wireframe is a **low-fidelity reference for structure and colour, not a finish line.** Build to
the standard Apple applies to its own dashboards: restrained, precise, and physical without being
decorative.

Five rules produce most of that difference:

1. **A fine vertical gradient on filled surfaces.** Never a flat fill. Light at the top, base colour
   at the foot, so it reads as a lit surface rather than a printed rectangle.
2. **An inset hairline along the top edge.** `inset 0 1px 0 rgb(255 255 255 / …)`. This is the single
   highest-value detail and the one most often skipped.
3. **Soft, short-range elevation.** A 1–2px shadow at 5–20% opacity. Never a large blurry drop.
4. **Spring on press.** `active:scale-[0.97]`, gradient flattened, shadow removed, so the control moves
   under the finger. Keep the press transition faster than the hover one.
5. **Tight typography.** `tracking-[-0.006em]` at body sizes, medium weight, and font smoothing on.

Radii live at 8px (`rounded-control`) for controls and 12px for panels. Both are rounder than the
wireframe's 6px, which is most of what separates "considered" from "default".

Everything above is already expressed as tokens in `src/index.css`, so use `shadow-control`,
`shadow-control-solid`, `rounded-control` and the colour tokens rather than re-deriving values.

## House rules

- **300 lines maximum per component.** Split rather than exceed it. This keeps files easy to review
  and to regenerate with AI. **Enforced in CI**: the `Component size` workflow fails any push where
  a file under `src/components/` goes over. Check before pushing with `npm run check:size`, or try a
  different limit with `COMPONENT_LINE_LIMIT=200 npm run check:size`.
- **Import with the `@` alias**: `import { Button } from '@/components/primitives/Button'`.
- **A missing reading renders as an em-dash, never `0`.** The client's data has permanently empty
  sensor columns and devices that drop offline; showing zero would be a scientific error.
- **Array and standalone chambers report different fields.** Keep them as separate types rather than
  one shape with optional properties.
- **Charts need colour *and* dash style per series**, so they stay readable in greyscale and for
  colour-blind viewers.

## Reference

The wireframe, the component list and the client's own requirements live in the project folder one
level up:

- `COMPONENT_INVENTORY.md`: every component, what it does, which screen it appears on
- `FRONTEND_PLAN.md`: screen-by-screen analysis and build order
- `context/wireframe/`: wireframe screenshots
- `context/DASHBOARD_DATA_SPEC.md`: the client's data spec and flux method
