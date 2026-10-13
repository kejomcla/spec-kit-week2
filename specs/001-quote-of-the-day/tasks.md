# Tasks: Quote of the Day

**Feature**: Quote of the Day (`001-quote-of-the-day`)  
**Input**: Feature specification from `specs/001-quote-of-the-day/spec.md`, implementation plan from `specs/001-quote-of-the-day/plan.md`, data model from `specs/001-quote-of-the-day/data-model.md`, and contracts from `specs/001-quote-of-the-day/contracts/services.contract.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic workspace structure

- [X] T001 Create project directories (`src/data/`, `src/services/`, `tests/unit/`) per implementation plan
- [X] T002 [P] Create `package.json` with `"type": "module"` and test command `"test": "node --test tests/unit/*.test.js"` in `package.json`
- [X] T003 [P] Create baseline semantic HTML shell with metadata, viewport, and stylesheet link in `index.html`
- [X] T004 [P] Create CSS baseline reset, typography, and color variables in `styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and service modules required across all user stories

⚠️ **CRITICAL**: No user story implementation can begin until foundational services are complete and verified.

- [X] T005 Create built-in quote catalog with unique `id`, non-empty `text`, and non-empty `author` attributes in `src/data/quotes.js`
- [X] T006 [P] Create automated unit tests for QuoteService covering catalog retrieval and non-repeating `getRandomQuote(excludeId)` logic in `tests/unit/quote-service.test.js`
- [X] T007 Implement QuoteService satisfying contracts (`getAllQuotes`, `getRandomQuote`, `getQuoteById`) in `src/services/quote-service.js`
- [X] T008 [P] Create automated unit tests for FavoriteStore covering `isFavorite`, `toggleFavorite`, `getFavorites`, `localStorage` key `"qotd_favorites_v1"`, and in-memory fallback on storage errors in `tests/unit/favorite-store.test.js`
- [X] T009 Implement FavoriteStore with `localStorage` persistence and graceful fallback handling in `src/services/favorite-store.js`

**Checkpoint**: Foundation ready — all domain services tested and ready for user story integration.

---

## Phase 3: User Story 1 - Viewing a Random Quote of the Day (Priority: P1) 🎯 MVP

**Goal**: Display an initial random quote with text and author attribution from the catalog immediately upon page load.

**Independent Test**: Load `index.html` in a web browser; verify that `#quote-text` and `#quote-author` visibly render a valid quote from `src/data/quotes.js`.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create quote display container with `#quote-card`, `#quote-text`, `#quote-author`, and `aria-live="polite"` in `index.html`
- [X] T011 [P] [US1] Style quote card presentation, typography, and responsive centering in `styles.css`
- [X] T012 [US1] Implement application bootstrapping to select initial random quote and render text and author on `DOMContentLoaded` in `src/app.js`

**Checkpoint**: User Story 1 complete — viable MVP delivers random quote display on load.

---

## Phase 4: User Story 2 - Requesting a New Quote (Priority: P2)

**Goal**: Allow users to click a "New quote" button to view another quote without full page reload, preventing immediate consecutive duplicates.

**Independent Test**: Click `#new-quote-btn` and verify that the quote updates dynamically to a different quote from the catalog.

### Implementation for User Story 2

- [X] T013 [P] [US2] Add accessible "New quote" button with `id="new-quote-btn"` and `aria-label="Get another quote"` in `index.html`
- [X] T014 [P] [US2] Style "New quote" button with hover, active, and accessible focus outlines in `styles.css`
- [X] T015 [US2] Wire `#new-quote-btn` click event listener to request a non-repeating quote via `QuoteService.getRandomQuote` and update the DOM in `src/app.js`

**Checkpoint**: User Stories 1 and 2 complete — users can view quotes and generate new ones on demand.

---

## Phase 5: User Story 3 - Favoriting and Unfavoriting Quotes with Persistence (Priority: P3)

**Goal**: Allow users to toggle favorite status on the displayed quote, persisting state in `localStorage` across page reloads.

**Independent Test**: Click favorite toggle on a quote, reload page, cycle back to that quote and verify favorite state remains active.

### Implementation for User Story 3

- [X] T016 [P] [US3] Add accessible favorite toggle button with `id="favorite-btn"`, `aria-pressed="false"`, and `aria-label="Toggle favorite"` in `index.html`
- [X] T017 [P] [US3] Style favorite button active/inactive states with visual icon and smooth transitions in `styles.css`
- [X] T018 [US3] Wire `#favorite-btn` click event to `FavoriteStore.toggleFavorite` and update visual state upon toggle and quote change in `src/app.js`

**Checkpoint**: User Stories 1, 2, and 3 complete — core feature set implemented.

---

## Phase 6: User Story 4 - Favorited Quote Roll Celebration (Diagonal Shimmer) (Priority: P4)

**Goal**: Trigger a temporary diagonal shimmer animation across `#quote-card` when a previously favorited quote is rolled, while respecting reduced motion preferences.

**Independent Test**: Roll a previously favorited quote; verify that `#quote-card` receives `.shimmer-active` and animates a diagonal sweep across the card before resetting.

### Tests for User Story 4

- [X] T019 [P] [US4] Add automated unit tests verifying that QuoteApp adds `.shimmer-active` when rolling a favorited quote and removes it on unfavorited roll in `tests/unit/app.test.js`

### Implementation for User Story 4

- [X] T020 [P] [US4] Define `@keyframes shimmer` (115° diagonal sweep), `#quote-card::after` pseudo-element styling, and `@media (prefers-reduced-motion: reduce)` suppression in `styles.css`
- [X] T021 [US4] Implement shimmer triggering on favorited roll and `animationend` cleanup in `src/app.js`

**Checkpoint**: User Story 4 complete — celebratory shimmer effect triggers cleanly for favorited rolls.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, accessibility hardening, and documentation checks

- [X] T022 [P] Verify touch targets (>=44px), high contrast legibility, and keyboard focus outlines across all viewport sizes in `styles.css`
- [X] T023 Execute automated test suite with `npm test` and verify all tests pass
- [X] T024 Perform manual end-to-end validation across all scenarios in `specs/001-quote-of-the-day/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: Setup ───► Phase 2: Foundational ───► Phase 3: US1 (P1 MVP)
                                                    │
                                                    ├───► Phase 4: US2 (P2)
                                                    │
                                                    └───► Phase 5: US3 (P3)
                                                                │
                                                                ▼
                                                        Phase 6: US4 (P4 Shimmer)
                                                                │
                                                                ▼
                                                        Phase 7: Polish
```

- **Phase 6 (User Story 4)**: Depends on Phase 5 completion (`FavoriteStore` and favorite state coordination).
- **Phase 7 (Polish)**: Runs after all user stories are complete.

### Parallel Opportunities

- In Phase 6: Test creation `T019` and CSS keyframes styling `T020` can run in parallel before event wiring `T021`.

---

## Parallel Example: User Story 4

```bash
# Launch test update and CSS animation in parallel:
Task: "T019 [P] [US4] Add automated unit tests verifying that QuoteApp adds .shimmer-active in tests/unit/app.test.js"
Task: "T020 [P] [US4] Define @keyframes shimmer and prefers-reduced-motion in styles.css"

# Then wire coordination:
Task: "T021 [US4] Implement shimmer triggering on favorited roll and animationend cleanup in src/app.js"
```

---

## Implementation Strategy

### Incremental Delivery
1. Foundational + US1-US3 delivered (MVP + New Quote + Persistent Favorites).
2. Implement US4 (Diagonal shimmer celebration for favorited rolls).
3. Run full automated test suite (`npm test`).
4. Validate manual end-to-end scenarios (including reduced-motion).
