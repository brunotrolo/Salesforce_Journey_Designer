# `page/` — Route-level (outer) components

Each component here is a **full-page view** tied to a route. They get the `page-*` prefix (e.g. `page-user`, `page-home`).

**Use this namespace for:**

- Screens that correspond to a URL
- Top-level views that the router renders

Register new pages in `src/router.js` and in `shell/app`’s `ROUTE_COMPONENTS`.
