# GHG Components

React components for **P24 — Online Platform to Manage and Monitor GHG Systems**, the SOFT3888
capstone project for USYD SOLES.

These are built and reviewed **in isolation** here, then copied across to the group repository.

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Lint | oxlint |

Tailwind 4 is configured **in CSS**, not a JS config file — design tokens live in the `@theme` block
in `src/index.css`. There is no `tailwind.config.js`.

## Getting started

```bash
npm install
npm run dev        # component gallery at http://localhost:5173
npm run build      # typecheck + production build
npm run lint       # oxlint
npm run typecheck  # types only
```

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
│                     discriminated union — they report different fields.
├── lib/              Shared helpers
├── mocks/            Sample data, including deliberately malformed records
└── App.tsx           The component gallery
```

## House rules

- **300 lines maximum per component.** Split rather than exceed it. This keeps files easy to review
  and to regenerate with AI.
- **Import with the `@` alias** — `import { Button } from '@/components/primitives/Button'`.
- **A missing reading renders as an em-dash, never `0`.** The client's data has permanently empty
  sensor columns and devices that drop offline; showing zero would be a scientific error.
- **Array and standalone chambers report different fields.** Keep them as separate types rather than
  one shape with optional properties.
- **Charts need colour *and* dash style per series**, so they stay readable in greyscale and for
  colour-blind viewers.

## Reference

The wireframe, the component list and the client's own requirements live in the project folder one
level up:

- `COMPONENT_INVENTORY.md` — every component, what it does, which screen it appears on
- `FRONTEND_PLAN.md` — screen-by-screen analysis and build order
- `context/wireframe/` — wireframe screenshots
- `context/DASHBOARD_DATA_SPEC.md` — the client's data spec and flux method
