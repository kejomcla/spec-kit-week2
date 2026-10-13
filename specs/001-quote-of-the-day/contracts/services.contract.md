# Service & Component Contracts: Quote of the Day

**Feature**: Quote of the Day (`001-quote-of-the-day`)  
**Date**: 2026-10-12  
**Status**: Completed  

---

## 1. `QuoteService` Contract

Manages access to the built-in quote catalog and randomized selection logic.

### Interface Definition
```typescript
interface Quote {
  id: string;
  text: string;
  author: string;
}

interface IQuoteService {
  /**
   * Retrieves all available quotes in the catalog.
   */
  getAllQuotes(): ReadonlyArray<Quote>;

  /**
   * Returns a randomly chosen quote from the catalog.
   * If excludeId is provided and the catalog contains > 1 quotes,
   * the returned quote is guaranteed to have an id !== excludeId.
   */
  getRandomQuote(excludeId?: string | null): Quote;

  /**
   * Retrieves a quote by its identifier.
   */
  getQuoteById(id: string): Quote | undefined;
}
```

---

## 2. `FavoriteStore` Contract

Manages persistence of favorited quote IDs in client-side storage.

### Interface Definition
```typescript
interface IFavoriteStore {
  /**
   * Checks whether a given quote ID is currently marked as favorite.
   */
  isFavorite(quoteId: string): boolean;

  /**
   * Toggles the favorite status for a quote ID.
   * Persists changes to storage immediately.
   * Returns the new favorite status (true if favorited, false if unfavorited).
   */
  toggleFavorite(quoteId: string): boolean;

  /**
   * Returns a copy of all favorited quote IDs.
   */
  getFavorites(): string[];

  /**
   * Clears all stored favorites (primarily for testing and reset flows).
   */
  clear(): void;
}
```

---

## 3. DOM & UI Component Contract

Defines the HTML structure, accessibility bindings, and visual animation states.

### Required DOM Elements & Classes
| Selector / Class | Tag | Purpose | Accessible Attributes |
| :--- | :--- | :--- | :--- |
| `#quote-card` | `<article>` | Container for the displayed quote | `aria-live="polite"` |
| `#quote-card.shimmer-active` | Class | Active state triggering diagonal shimmer animation | Cleared automatically on `animationend` |
| `#quote-text` | `<blockquote>` | Text of the quotation | None |
| `#quote-author` | `<cite>` | Author of the quotation | None |
| `#new-quote-btn` | `<button>` | Action to request another random quote | `aria-label="Get another quote"` |
| `#favorite-btn` | `<button>` | Toggle button for favorite state | `aria-pressed="false|true"`, `aria-label="Toggle favorite"` |

### Animation & Accessibility Contract
- **Diagonal Shimmer**:
  - Activated by appending class `shimmer-active` to `#quote-card` whenever a favorited quote is rolled.
  - Automatically removed upon receipt of `animationend` event or when an unfavorited quote is rolled.
  - MUST be suppressed under `@media (prefers-reduced-motion: reduce)` with `animation: none !important`.
