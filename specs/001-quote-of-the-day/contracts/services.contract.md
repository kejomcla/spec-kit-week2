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

### Preconditions & Postconditions
- **`getRandomQuote(excludeId)`**:
  - *Precondition*: Catalog has at least 1 quote.
  - *Postcondition*: If catalog length > 1, returned `Quote.id !== excludeId`.

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

### Exception Safety
- Methods MUST NOT throw when `localStorage` is disabled or throws `QuotaExceededError`. The store falls back silently to session in-memory state.

---

## 3. DOM & UI Component Contract

Defines the HTML structure and accessibility bindings required by the application shell.

### Required DOM Elements
| Selector / ID | Tag | Purpose | Accessible Attributes |
| :--- | :--- | :--- | :--- |
| `#quote-card` | `<article>` | Container for the displayed quote | `aria-live="polite"` |
| `#quote-text` | `<blockquote>` | Text of the quotation | None |
| `#quote-author` | `<cite>` | Author of the quotation | None |
| `#new-quote-btn` | `<button>` | Action to request another random quote | `aria-label="Get another quote"` |
| `#favorite-btn` | `<button>` | Toggle button for favorite state | `aria-pressed="false|true"`, `aria-label="Toggle favorite"` |

### Event Behaviors
- **Click `#new-quote-btn`**: Triggers `getRandomQuote(currentQuote.id)` and re-renders `#quote-card`.
- **Click `#favorite-btn`**: Triggers `toggleFavorite(currentQuote.id)` and toggles `aria-pressed` state and visual icon.
- **Keyboard navigation**: Both buttons MUST be reachable and activatable via `Tab` and `Enter`/`Space`.
