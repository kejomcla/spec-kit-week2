import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { QuoteApp } from "../../src/app.js";
import { QuoteService } from "../../src/services/quote-service.js";
import { FavoriteStore } from "../../src/services/favorite-store.js";

/**
 * Lightweight mock element for testing QuoteApp interactions
 */
class MockElement {
  constructor(id) {
    this.id = id;
    this.textContent = "";
    this.attributes = new Map();
    this.listeners = new Map();
    this._classes = new Set();
  }

  get classList() {
    return {
      add: (cls) => this._classes.add(cls),
      remove: (cls) => this._classes.delete(cls),
      contains: (cls) => this._classes.has(cls),
      toggle: (cls, force) => {
        if (force === undefined) {
          if (this._classes.has(cls)) {
            this._classes.delete(cls);
            return false;
          }
          this._classes.add(cls);
          return true;
        }
        if (force) {
          this._classes.add(cls);
          return true;
        }
        this._classes.delete(cls);
        return false;
      }
    };
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  addEventListener(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(handler);
  }

  click() {
    const handlers = this.listeners.get("click") || [];
    for (const h of handlers) h();
  }

  trigger(event, data = {}) {
    const handlers = this.listeners.get(event) || [];
    for (const h of handlers) h(data);
  }
}

class MockDocument {
  constructor() {
    this.elements = new Map();
    ["quote-card", "quote-text", "quote-author", "new-quote-btn", "favorite-btn", "favorite-text"].forEach(id => {
      this.elements.set(id, new MockElement(id));
    });
  }

  getElementById(id) {
    return this.elements.get(id) || null;
  }
}

describe("QuoteApp Integration", () => {
  const sampleCatalog = [
    { id: "q-1", text: "Quote 1", author: "Author 1" },
    { id: "q-2", text: "Quote 2", author: "Author 2" }
  ];

  let doc;
  let quoteService;
  let favoriteStore;
  let app;

  beforeEach(() => {
    doc = new MockDocument();
    quoteService = new QuoteService(sampleCatalog);
    favoriteStore = new FavoriteStore();
    app = new QuoteApp(quoteService, favoriteStore, doc);
  });

  it("should display a quote upon init (US1)", () => {
    app.init();
    const textEl = doc.getElementById("quote-text");
    const authorEl = doc.getElementById("quote-author");
    assert.ok(textEl.textContent.length > 0);
    assert.ok(authorEl.textContent.length > 0);
    assert.ok(sampleCatalog.some(q => q.text === textEl.textContent));
  });

  it("should display a new quote when clicking new-quote-btn (US2)", () => {
    app.init();
    const firstQuoteId = app.currentQuote.id;
    const newQuoteBtn = doc.getElementById("new-quote-btn");

    newQuoteBtn.click();
    const secondQuoteId = app.currentQuote.id;

    assert.notEqual(firstQuoteId, secondQuoteId, "Should switch to a different quote");
  });

  it("should toggle and persist favorite state on clicking favorite-btn (US3)", () => {
    app.init();
    const quoteId = app.currentQuote.id;
    const favoriteBtn = doc.getElementById("favorite-btn");
    const favoriteText = doc.getElementById("favorite-text");

    assert.equal(favoriteBtn.getAttribute("aria-pressed"), "false");
    assert.equal(favoriteText.textContent, "Favorite");

    // Click to favorite
    favoriteBtn.click();
    assert.equal(favoriteBtn.getAttribute("aria-pressed"), "true");
    assert.equal(favoriteText.textContent, "Favorited");
    assert.equal(favoriteStore.isFavorite(quoteId), true);

    // Click to unfavorite
    favoriteBtn.click();
    assert.equal(favoriteBtn.getAttribute("aria-pressed"), "false");
    assert.equal(favoriteText.textContent, "Favorite");
    assert.equal(favoriteStore.isFavorite(quoteId), false);
  });

  it("should synchronize favorite button when navigating to previously favorited quote (US3)", () => {
    app.init();
    const quote1 = sampleCatalog[0];
    favoriteStore.toggleFavorite(quote1.id); // favorite quote 1 in store

    app.currentQuote = quote1;
    app._renderCurrentQuote();

    const favoriteBtn = doc.getElementById("favorite-btn");
    assert.equal(favoriteBtn.getAttribute("aria-pressed"), "true");
    assert.equal(doc.getElementById("favorite-text").textContent, "Favorited");
  });

  it("should trigger shimmer on quote-card when rolling a favorited quote (US4)", () => {
    const card = doc.getElementById("quote-card");
    const favQuote = sampleCatalog[0];
    favoriteStore.toggleFavorite(favQuote.id); // favorited in store

    app.currentQuote = favQuote;
    app._renderCurrentQuote();

    assert.equal(card.classList.contains("shimmer-active"), true, "Card should have shimmer-active class");
  });

  it("should not trigger shimmer on quote-card when rolling an unfavorited quote (US4)", () => {
    const card = doc.getElementById("quote-card");
    const unfavQuote = sampleCatalog[1];

    app.currentQuote = unfavQuote;
    app._renderCurrentQuote();

    assert.equal(card.classList.contains("shimmer-active"), false, "Card must not have shimmer-active class");
  });

  it("should remove shimmer-active when animationend is triggered (US4)", () => {
    const card = doc.getElementById("quote-card");
    const favQuote = sampleCatalog[0];
    favoriteStore.toggleFavorite(favQuote.id);

    app.currentQuote = favQuote;
    app._renderCurrentQuote();
    assert.equal(card.classList.contains("shimmer-active"), true);

    // Simulate animationend event
    card.trigger("animationend");
    assert.equal(card.classList.contains("shimmer-active"), false, "shimmer-active should be removed on animationend");
  });
});
