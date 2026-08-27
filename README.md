# Bundle Builder

A production-style React frontend for configuring a Wyze-style home security bundle. Customers step through cameras, a cloud plan, sensors, and accessories while a live review panel stays in sync with every quantity and variant change.

This is a frontend take-home: the Figma file is the visual source of truth, and the assignment spec is the functional source of truth.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Vitest + Testing Library
- Client-side persistence via `localStorage`

No global store, component library, or routing layer. The app is a single view with one domain hook.

## Architecture

```text
src/
  data/products.json      Catalog and seed quantities
  types/bundle.ts         Domain types
  utils/                  Pure pricing, selection, and persistence logic
  hooks/useBundleState.ts Single source of truth for the bundle
  components/ui/          Reusable primitives (Button, Typography, Price, …)
  components/             Feature UI (accordion, cards, review)
```

**Data.** Products are declared in JSON. React renders capabilities (badge, variants, compare-at price, locked quantity) from the data. There is no product-specific JSX.

**State.** `useBundleState` owns selections, the active variant per product, and which accordion step is open. Builder and review both read that state. Totals, step counters, and checkout availability are derived.

**Selections.** A line is `productId::variantId`. Switching White → Grey does not clear White’s quantity; the stepper then operates on Grey. The review panel lists every variant with quantity > 0 as its own row.

**Pricing.** Money is integer cents inside `src/utils`. Currency strings are formatted only at the UI boundary (`Price`, `formatCents`).

**Persistence.** “Save my system for later” writes selections and active variants to `localStorage`. Accordion open state is UI-only and is not persisted. Corrupt or unknown keys are skipped; a fully invalid payload falls back to the design seed.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (Vite defaults to `http://localhost:5173`).

## Commands

| Command             | Purpose                       |
| ------------------- | ----------------------------- |
| `npm run dev`       | Vite dev server               |
| `npm run build`     | Typecheck + production bundle |
| `npm run preview`   | Serve the production build    |
| `npm run lint`      | ESLint                        |
| `npm run test`      | Vitest (single run)           |
| `npm run typecheck` | `tsc -b`                      |

## Important decisions

- **Tailwind, not CSS modules.** Design tokens live in `src/index.css` (`@theme`) so color, radius, and breakpoint values stay centralized. One-off Figma measurements use arbitrary values (`w-[65px]`, `max-w-[1213px]`).
- **No Zustand/Redux.** A hook plus pure helpers is enough for this surface area and stays easy to test.
- **Gilroy is not loaded from the web.** It is a licensed font. Inter is the delivered webfont, with Gilroy kept in the stack if it is installed locally.
- **Desktop layout follows Figma, not a generic two-column dashboard.** At 1440px the builder is full width with a five-column product grid and the review panel underneath. Between 768px and 1439px the review column sits beside the steps and sticks. Phones stack builder then review.
- **Checkout is a demo action.** There is no payment backend.

## Tradeoffs

- Product art is file-name driven. Missing assets fall back to a placeholder rather than blocking render.
- The required Sense Hub is locked at its seeded quantity so it cannot be removed from a sensor bundle.
- Persistence restores configuration, not which accordion step was open.

## Intentionally not implemented

- Payment processing / real checkout
- A backend catalog or order API
- Motion beyond the small hover/focus transitions in the design
