# Gambit Cloud Resource Explorer

A small client-only UI to browse cloud resources, group a selection into a named **Application**, and visualize an Application as a graph. Built for Gambit's Frontend Take-Home.

## Run it

```bash
npm install && npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build   # tsc -b && vite build - typecheck + production build
npm run test    # vitest (19 tests)
npm run lint    # oxlint
npm run format  # prettier --write .
```

Format-on-save works out of the box in VS Code (`.vscode/settings.json` + the recommended Prettier extension); run `npm run format` for other editors.

## What I built

A single-page web app (Vite + React + TypeScript), with all state held client-side per the brief. It's built around two main views, switched with tabs: a **Resources** list and an **Applications** view. The app is responsive and adapts to a range of viewports - desktop, laptop, tablet, and mobile.

### Core requirements

- **Browse & filter** the resource list - search by name plus provider/environment/criticality filters, combinable.
- **Select multiple resources and group them into a named Application**, with an optional description.
- **List the Applications created**, with their resource counts.
- **Visualize an Application as a graph** - a central Application node connected to its member resources.

### Beyond the spec

A few things I added that weren't asked for but seemed worth including:

- A small **Zustand store with `localStorage` persistence** for Applications, so they survive a page refresh instead of disappearing the moment you reload (details and trade-offs under "Key decisions" below).
- **Delete an Application** from the graph drawer, guarded by a two-click confirm instead of a blocking `confirm()`.
- The resource list is **virtualized** ([`@tanstack/react-virtual`](https://tanstack.com/virtual)) and responsive (columns collapse on narrow screens), search is debounced and clearable inline.
- **Owner shows up wherever a resource name gets a tooltip** (table rows, the create-dialog's chips, the graph drawer's member list).
- **Search-match highlighting:** the part of a resource's name that matched the current search term is highlighted inline (`HighlightedText`).
- An **error boundary** wrapping the app (`ErrorBoundary`, in `main.tsx`), so an unexpected render error shows a recoverable "Something went wrong" screen instead of an unmounted, blank page.

## Key decisions (and why)

- **`localStorage` persistence isn't in the spec - I added it anyway, and want to be upfront about that.** The brief only asks to "hold state in the client," which plain in-memory state already satisfies - nothing requires Applications to survive a page refresh. I layered Zustand's `persist` middleware on top of the store anyway because it's a small, zero-new-dependency addition that noticeably improves the experience of actually using the app (create an Application, refresh the page mid-review, and it's still there). It's scoped to only the Applications store - filters, search, and selection are deliberately left unpersisted.
- **Zustand for the one piece of state that needs to live above the tabs; plain `useState` for everything else.** I reached for a small Zustand store (`useApplicationsStore`) rather than React Context because there's exactly one piece of cross-cutting state and a handful of mutations (create/delete). Context would mean writing a Provider, a hook, and wiring it into the tree for what Zustand gives in ~20 lines with nothing to wrap the app in. Filters, search, selection, and dialog/drawer open state are deliberately not promoted to the store - they're `useState` in `App.tsx` or the owning component, since they never need to escape their own subtree and globalizing them would just be indirection.
- **The resource list is virtualized even though today's 15 rows don't need it.** `ResourceTable`/`ResourceRow` are flex-based divs (not a native `<table>`) wrapped in `@tanstack/react-virtual`, which only mounts the rows currently scrolled into view - a deliberate ahead-of-need choice, called out with a comment at the wiring site in `ResourceTable.tsx`. If this ever backs a real cloud inventory with thousands of resources, the DOM and render cost stay flat instead of growing with the dataset.
- **No graph library.** The required visualization is always a single hub with N spokes - a ~40-line SVG component with `useMemo`'d radial positions covers it without a dependency. (Considered [`@xyflow/react`](https://reactflow.dev/) if the graph needed to be interactive/draggable - it doesn't here.) If a real, heavier graph library were used instead, I'd lazy-load it (`React.lazy` + `Suspense`, or a dynamic `import()`) behind the graph drawer rather than bundling it into the main chunk - the graph is only ever needed once a user opens an Application, not on initial page load.
- **Radix UI for primitives that have real interaction/accessibility behavior to get right, hand-rolled Tailwind for the ones that don't.** I like Radix specifically for its per-component imports, headless/unstyled components, and because it's a library I'm already familiar with.
- **No routing library (e.g. react-router).** Everything is one page with two in-memory tabs (Resources / Applications) - there was no case for URL-addressable routes, so a router would just be unused weight.
- **No data-fetching/caching library (e.g. react-query).** There's no backend and no async data in this assignment - the resource list is a static in-memory array. Adding one would mean inventing a fake network layer just to use it.
- **`Resource.openIssues`:** the spec's `Resource` type doesn't include this field, though the sample data and the display requirements need it. I added `openIssues: number` to reconcile that gap (noted here since I was asked to flag any such gaps).
- **Checkbox-only selection, not click-anywhere-on-the-row.** I thought it'd be nice to trigger selection off the whole row, not just the checkbox - a bigger, more forgiving hit target. But that led me to a new concern: dragging to highlight/copy a resource's name (a normal thing to want to do in a table like this) would also toggle the row, since the mouseup at the end of that drag still fires a click. I built and verified a fix for it (checking `window.getSelection()` at click-time and skipping the toggle if there's an active text selection), but on reflection it was solving a problem I'd created rather than one that existed - the checkbox alone is already an unambiguous, easy-to-hit target, and no interaction cost was worth trading for it.
- **Prettier for formatting, no ESLint.** oxlint already covers linting (including the React Compiler rule, see below), so adding ESLint on top would just be a second linter doing overlapping and possibly conflicting work for no real benefit. Prettier fills the actual gap - consistent formatting and format-on-save - without touching linting at all. `prettier-plugin-tailwindcss` is included too, so class lists get sorted automatically on save.

## Testing

19 Vitest + React Testing Library tests across five files, chosen to cover judgment/logic rather than everything:

- `lib/filter.test.ts` - the pure filtering function: search matching, each filter dimension alone and combined, empty-result case.
- `lib/display.test.ts` - the `splitByMatch` helper behind search-highlighting: no query, no match, and a match in the middle or at either edge.
- `stores/useApplicationsStore.test.ts` - application creation produces unique ids and correct `resourceIds`; deletion removes only the targeted application; corrupted `localStorage` falls back to an empty list instead of throwing.
- `components/CreateApplicationDialog/CreateApplicationDialog.test.tsx` - submit is disabled with no name or no selection, and a valid submit calls through to the store with the right payload.
- `components/ResourceTable/ResourceTable.test.tsx` - an efficiency check: rendering 1,000 vs. 5,000 resources mounts the same small, bounded number of row elements instead of one per resource (proves the virtualizer is actually windowing, not just present), plus a `Profiler`-based smoke test that flags an exceptionally slow render (a generous bound, not a tight perf budget - render timing varies by machine/CI).

**Not tested** (conscious timebox cut, verified manually in-browser instead): the SVG graph's layout and responsive breakpoints.

The app was also manually tested across browsers - Chrome, Safari, and Firefox - to catch any rendering or behavior differences beyond what the automated tests cover.

## What I'd do next

- **A paginated resource list backed by a real API.** The list is already virtualized client-side (see above), but that only bounds _rendering_ cost - it still assumes the full dataset is in memory. Once there's an actual backend, I'd paginate the `GET` (page/cursor-based) and fetch server-side page-by-page instead of loading everything into the client; virtualization plus infinite-scroll-style incremental fetching would then compose naturally on top of what's already there.
- **Prefetch the inactive tab's content on load**, so switching from Resources to Applications (or back) feels instant instead of doing the work on first switch.
- **Multiple levels in the graph.** Today it's a single hub with one ring of resource spokes, which matches the spec (an Application connected to its member resources) and today's flat data model. If Applications could contain other Applications, or resources had their own dependencies on each other, the graph would need to become a real multi-level tree/DAG layout - at that point the hand-rolled radial SVG stops being enough and it's worth pulling in a proper graph library (e.g. `@xyflow/react`) for layout, pan/zoom, and collapsing/expanding subtrees.
- **If a real backend existed:** react-query for fetching, caching, and optimistic updates - the caching that `localStorage` is standing in for today (see "Key decisions" above) would move to react-query's cache instead, and `localStorage` would stop being the source of truth.
- Filter by tag, not just provider/environment/criticality (tags exist in the model and are shown in the create-dialog chips, but aren't a filter today).
- Edit an existing Application (rename, add/remove members) - only creation, viewing, and deletion are in scope today.
- Playwright E2E covering the full select → create → view-graph path.
- Pin selected resources to the top of the list, so a selection stays visible/reachable instead of scrolling out of view once you've picked from further down a long, virtualized list.
- Copy-to-clipboard on a row (e.g. its name or ID), for quickly grabbing a resource's identifier without needing to open anything else.
- **React Compiler**, once the app is big enough to have real render-cost hotspots worth auto-memoizing - today there's nothing to fix, so turning it on would just add a slower Babel-based dev transform in place of Vite's normal esbuild/SWC pipeline for no measurable benefit. Already got a taste of it cheaply: `react/react-compiler` is enabled in `.oxlintrc.json` (oxlint ports the same static analysis natively, no separate `eslint-plugin-react-compiler`/ESLint install needed), and it's already flagged two real "reset state via a `useEffect`" spots worth fixing (`ApplicationGraphDrawer`, `CreateApplicationDialog`) - a good example of the lint value being separable from the runtime compiler.
- **A more advanced table** (e.g. [`@tanstack/table`](https://tanstack.com/table)) that lets users customize the table to their needs and save those preferences to `localStorage`/`sessionStorage`.

## Where I used AI

After considering the requirements and planning the UI, I wrote the main architecture and structure for this repo, making the calls on what to use and where. The component structure and the relationships between them were designed by me.

I used Claude Code to turn my general plan into something detailed and precise, and to check whether I'd left open cases or missed something from the requirements.

I also used it to harden components against edge cases (corrupted storage, long names, empty states), and to measure and consult on rendering-efficiency options.

I consulted it in planning mode on a handful of decisions where I had a few reasonable options to weigh.

One piece I left fully to Claude to code, after designing and planning the component myself, is the graph visualization - built end to end as hand-rolled SVG. In a real production build, I'd likely reach for a graph library instead, as noted above.

Finally, I used AI to write the tests, mocks, and this doc 🙂
