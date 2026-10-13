# Quickstart & Validation Guide: Quote of the Day

**Feature**: Quote of the Day (`001-quote-of-the-day`)  
**Date**: 2026-10-12  
**Status**: Ready  

---

## 1. Prerequisites

- A modern evergreen web browser (Google Chrome, Firefox, Microsoft Edge, Safari).
- Node.js (v18+) for running automated unit tests for service modules (optional for simply viewing the web app).

---

## 2. Running the Application Locally

The application is built with standard HTML5, CSS3, and modern JavaScript modules. It can be served using any local static web server:

### Option A: Using Python Simple HTTP Server
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option B: Using Node.js `npx serve`
```bash
npx serve .
```

### Option C: Direct File Access
Open `index.html` directly in your browser. (Note: standard ES modules may require a local server in some strict browser security environments; serving via HTTP is recommended).

---

## 3. Running Automated Tests

To run the automated domain and unit tests verifying the Quote Service and Favorite Store:

```bash
node --test tests/unit/
```

Expected output:
- `tests/unit/quote-service.test.js`: All tests pass (validates random pick, non-repetition, catalog integrity).
- `tests/unit/favorite-store.test.js`: All tests pass (validates toggling, persistence serialization, fallback on storage failure).

---

## 4. End-to-End Manual Validation Scenarios

Follow these scenarios to verify the feature against acceptance criteria:

### Scenario 1: Initial Render & Quote Presentation
1. Open the application URL in a clean browser window.
2. **Verify**:
   - A non-empty quote text and author attribution are immediately visible.
   - Both "New quote" and favorite toggle buttons are visible and active.
   - Favorite button shows an unfavorited state (`aria-pressed="false"`).

### Scenario 2: Requesting a New Quote
1. Click the "New quote" button.
2. **Verify**:
   - The displayed quote changes immediately.
   - The new quote is different from the quote previously displayed.
   - Rapid clicking (3-4 clicks) smoothly changes quotes without errors in the browser console.

### Scenario 3: Favoriting with Session Persistence
1. With a quote displayed, click the favorite toggle button.
2. **Verify**:
   - The favorite indicator switches to active state (`aria-pressed="true"`).
3. Reload the browser page (F5 or Ctrl+R).
4. Click "New quote" until the previously favorited quote is displayed again.
5. **Verify**:
   - When that quote reappears, the favorite button automatically reflects the active favorited state.

### Scenario 4: Unfavoriting
1. While on the favorited quote, click the favorite button again.
2. **Verify**:
   - The favorite indicator switches to inactive (`aria-pressed="false"`).
3. Reload the browser and return to that quote; verify it remains unfavorited.
