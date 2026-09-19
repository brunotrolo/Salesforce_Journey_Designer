# `data/` — Plain modules (not components)

Folders here hold **JavaScript modules** imported with the `data/<name>` path (e.g. `import { getAllContacts } from 'data/contacts'`). They are **not** LWCs—there is no `data-*` tag in templates.

**Use this namespace for:**

- Shared data helpers, fixtures, or static datasets
- Code that pages or components import but that does not render UI by itself

**Do not use for:** anything that should be a custom element—put those under `ui/` (or route views under `page/`).

**Example:** Add `contacts/contacts.js` → import as `'data/contacts'` from your `page-*` or `ui-*` modules.
