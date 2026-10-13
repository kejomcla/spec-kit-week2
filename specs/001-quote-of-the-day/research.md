# Technical Research: Quote of the Day

**Feature**: Quote of the Day (`001-quote-of-the-day`)  
**Date**: 2026-10-12  
**Status**: Completed  

---

## 1. Application Architecture & Technology Selection

### Decision
Implement as a zero-dependency static web application using standard HTML5, CSS3, and modern vanilla JavaScript with ES modules (`type="module"`).

### Rationale
- The user requirements explicitly specify plain HTML, CSS, and JavaScript with no backend.
- Pure browser standards eliminate build pipelines, package manager overhead, and deployment complexity.
- Modern ES modules provide native file encapsulation and modularity without bundling tools (Webpack, Vite, etc.), fully adhering to Constitutional Principle III (Modularity).

### Alternatives Considered
- **React / Vue / Svelte SPA**: Rejected because adding a framework contradicts the explicit requirement for plain HTML/CSS/JS and adds unnecessary build tooling for a single-page feature.
- **Single monolithic JavaScript file**: Rejected because separating data, storage logic, quote selection logic, and DOM rendering keeps modules testable and maintainable (Constitutional Principle III).

---

## 2. Persistence Strategy: Client-Side Favorites

### Decision
Persist favorite quote IDs as a serialized JSON array of IDs in browser `localStorage` using a key named `qotd_favorites_v1`. Provide a graceful in-memory fallback if `localStorage` throws an error (e.g., SecurityError in private browsing or QuotaExceededError).

### Rationale
- `localStorage` is synchronously accessible, natively available across all modern browsers, and survives page reloads and browser restarts.
- Storing an array of string/number IDs rather than full quote objects prevents stale quote data if quote texts or authors are refined in the built-in catalog.
- Wrapping storage operations in a `FavoriteStorage` module protects against exceptions in restrictive browser environments (per FR-010).

### Alternatives Considered
- **IndexedDB**: Rejected as overly complex for a small array of quote IDs (asynchronous transactions and database version migrations are unnecessary overhead for this scale).
- **Cookies**: Rejected due to size limitations, automatic transmission over HTTP headers, and unnecessary complexity.

---

## 3. Random Selection Algorithm with Non-Repetition

### Decision
Implement a selection function that accepts the quote catalog and the ID of the currently displayed quote, filtering or sampling to guarantee that consecutive picks do not return the same quote (unless the catalog contains only 1 item).

### Rationale
- Fulfills FR-005 and avoids user frustration from clicking "New quote" and seeing no visible change.
- A simple deterministic filter/exclusion `catalog.filter(q => q.id !== currentId)` followed by `Math.floor(Math.random() * pool.length)` executes in $O(N)$ with $N \approx 20\text{–}50$, completing in $<0.1\text{ms}$.

### Alternatives Considered
- **Shuffled playlist / deck approach**: Shuffling an array and popping from it until empty. Rejected as unnecessarily stateful for simple "random pick with no immediate repeat", though could be considered for future extensions.
- **Pure Math.random() without exclusion**: Rejected because it frequently selects the identical quote twice in succession on small arrays.

---

## 4. Accessibility & UI Feedback

### Decision
- Use semantic HTML elements (`<main>`, `<article>`, `<blockquote>`, `<cite>`, `<button>`).
- Implement the favorite toggle as an accessible button using `aria-pressed="true|false"` and an accessible label (`aria-label="Add quote to favorites"` / `aria-label="Remove quote from favorites"`).
- Use an `aria-live="polite"` container or screen-reader announcement zone so that assistive technologies announce the updated quote when "New quote" is clicked.

### Rationale
- Ensures full keyboard and screen reader accessibility without third-party UI libraries.

---

## 5. Automated Verification & Testing Strategy

### Decision
Use standard Node.js built-in test runner (`node --test` introduced in Node.js 18+) or a lightweight zero-dependency Node test harness to test the pure domain logic (`QuoteService` and `FavoriteStorage` abstraction) in CI and local development.

### Rationale
- Fulfills Constitutional Principle II (Test-First & Automated Verification) without introducing heavy npm dependencies or bundlers.
- Domain logic is kept decoupled from DOM APIs, allowing rapid unit testing.
