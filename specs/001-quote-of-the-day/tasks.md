# Tasks: Quote of the Day

**Feature**: Quote of the Day (`001-quote-of-the-day`)  
**Input**: Feature specification from `specs/001-quote-of-the-day/spec.md`, implementation plan from `specs/001-quote-of-the-day/plan.md`, data model from `specs/001-quote-of-the-day/data-model.md`, and contracts from `specs/001-quote-of-the-day/contracts/services.contract.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic workspace structure

- [ ] T001 Create project directories (`src/data/`, `src/services/`, `tests/unit/`) per implementation plan
- [ ] T002 [P] Create `package.json` with `"type": "module"` and test command `"test": "node --test tests/unit/"` in `package.json`
- [ ] T003 [P] Create baseline semantic HTML shell with metadata, viewport, and stylesheet link in `index.html`
- [ ] T004 [P] Create CSS baseline reset, typography, and color variables in `styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and service modules required across all user stories

⚠️ **CRITICAL**: No user story implementation can begin until foundational services are complete and verified.

- [ ] T005 Create built-in quote catalog with unique `id`, non-empty `text`, and non-empty `author` attributes in `src/data/quotes.js`
- [ ] T006 [P] Create automated unit tests for QuoteService covering catalog retrieval and non-repeating `getRandomQuote(excludeId)` logic in `tests/unit/quote-service.test.js`
- [ ] T007 Implement QuoteService satisfying contracts (`getAllQuotes`, `getRandomQuote`, `getQuoteById`) in `src/services/quote-service.js`
- [ ] T008 [P] Create automated unit tests for FavoriteStore covering `isFavorite`, `toggleFavorite`, `getFavorites`, `localStorage` key `"qotd_favorites_v1"`, and in-memory fallback on storage errors in `tests/unit/favorite-store.test.js`
- [ ] T009 Implement FavoriteStore with `localStorage` persistence and graceful fallback handling in `src/services/favorite-store.js`

**Checkpoint**: Foundation ready — all domain services tested and ready for user story integration.

---

## Phase 3: User Story 1 - Viewing a Random Quote of the Day (Priority: P1) 🎯 MVP

**Goal**: Display an initial random quote with text and author attribution from the catalog immediately upon page load.

**Independent Test**: Load `index.html` in a web browser; verify that `#quote-text` and `#quote-author` visibly render a valid quote from `src/data/quotes.js`.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create quote display container with `#quote-card`, `#quote-text`, `#quote-author`, and `aria-live="polite"` in `index.html`
- [ ] T011 [P] [US1] Style quote card presentation, typography, and responsive centering in `styles.css`
- [ ] T012 [US1] Implement application bootstrapping to select initial random quote and render text and author on `DOMContentLoaded` in `src/app.js`

**Checkpoint**: User Story 1 complete — viable MVP delivers random quote display on load.

---

## Phase 4: User Story 2 - Requesting a New Quote (Priority: P2)

**Goal**: Allow users to click a "New quote" button to view another quote without full page reload, preventing immediate consecutive duplicates.

**Independent Test**: Click `#new-quote-btn` and verify that the quote updates dynamically to a different quote from the catalog.

### Implementation for User Story 2

- [ ] T013 [P] [US2] Add accessible "New quote" button with `id="new-quote-btn"` and `aria-label="Get another quote"` in `index.html`
- [ ] T014 [P] [US2] Style "New quote" button with hover, active, and accessible focus outlines in `styles.css`
- [ ] T015 [US2] Wire `#new-quote-btn` click event listener to request a non-repeating quote via `QuoteService.getRandomQuote` and update the DOM in `src/app.js`

**Checkpoint**: User Stories 1 and 2 complete — users can view quotes and generate new ones on demand.

---

## Phase 5: User Story 3 - Favoriting and Unfavoriting Quotes with Persistence (Priority: P3)

**Goal**: Allow users to toggle favorite status on the displayed quote, persisting state in `localStorage` across page reloads.

**Independent Test**: Click favorite toggle on a quote, reload page, cycle back to that quote and verify favorite state remains active.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Add accessible favorite toggle button with `id="favorite-btn"`, `aria-pressed="false"`, and `aria-label="Toggle favorite"` in `index.html`
- [ ] T017 [P] [US3] Style favorite button active/inactive states with visual icon and smooth transitions in `styles.css`
- [ ] T018 [US3] Wire `#favorite-btn` click event to `FavoriteStore.toggleFavorite` and update visual state upon toggle and quote change in `src/app.js`

**Checkpoint**: All three user stories complete — full functional feature set implemented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, accessibility hardening, and documentation checks

- [ ] T019 [P] Enhance mobile responsive styling, touch targets (>=44px), and keyboard navigation in `styles.css`
- [ ] T020 Execute automated test suite with `node --test tests/unit/` and verify all tests pass
- [ ] T021 Perform manual end-to-end validation across all scenarios documented in `specs/001-quote-of-the-day/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: Setup ───► Phase 2: Foundational ───► Phase 3: User Story 1 (P1 MVP)
                                                        │
                                                        ├───► Phase 4: User Story 2 (P2)
                                                        │
                                                        └───► Phase 5: User Story 3 (P3)
                                                                    │
                                                                    ▼
                                                            Phase 6: Polish
```

- **Phase 1 (Setup)**: Can start immediately; no dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion; blocks all user stories.
- **Phase 3 (User Story 1)**: Depends on Phase 2; produces the working MVP.
- **Phase 4 (User Story 2)**: Depends on Phase 3 UI structure; adds interactive new quote flow.
- **Phase 5 (User Story 3)**: Depends on Phase 3 & 4; adds favorite toggling and persistence synchronization.
- **Phase 6 (Polish)**: Runs after all user stories are complete.

### Parallel Opportunities

- In Phase 1: `T002`, `T003`, `T004` can run in parallel.
- In Phase 2: Test creation `T006` and `T008` can run in parallel before services are implemented.
- In Phase 3: HTML markup `T010` and styling `T011` can run in parallel before DOM event wiring `T012`.
- In Phase 4: Button markup `T013` and styling `T014` can run in parallel before event wiring `T015`.
- In Phase 5: Button markup `T016` and styling `T017` can run in parallel before event wiring `T018`.

---

## Parallel Example: User Story 1

```bash
# Launch markup and styling in parallel:
Task: "T010 [P] [US1] Create quote display container in index.html"
Task: "T011 [P] [US1] Style quote card presentation in styles.css"

# Then wire logic:
Task: "T012 [US1] Implement application bootstrapping in src/app.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete **Phase 1** (Setup).
2. Complete **Phase 2** (Foundational data catalog and QuoteService).
3. Complete **Phase 3** (User Story 1: initial random quote display).
4. **Validate MVP**: Open `index.html` to confirm working standalone quote-of-the-day display.

### Incremental Delivery
1. Deliver MVP (US1: View quote).
2. Add US2 (Generate new quote on demand).
3. Add US3 (Favorite toggle & persistent storage across reloads).
4. Run full test suite (`node --test tests/unit/`) and quickstart verification.
