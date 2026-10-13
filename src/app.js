import { QuoteService } from "./services/quote-service.js";
import { FavoriteStore } from "./services/favorite-store.js";

/**
 * Main application coordinator for Quote of the Day.
 */
export class QuoteApp {
  /**
   * @param {QuoteService} quoteService
   * @param {FavoriteStore} favoriteStore
   * @param {Document} [doc]
   */
  constructor(quoteService, favoriteStore, doc = document) {
    this.quoteService = quoteService;
    this.favoriteStore = favoriteStore;
    this.doc = doc;

    this.currentQuote = null;

    this.quoteCard = this.doc.getElementById("quote-card");
    this.quoteText = this.doc.getElementById("quote-text");
    this.quoteAuthor = this.doc.getElementById("quote-author");
    this.newQuoteBtn = this.doc.getElementById("new-quote-btn");
    this.favoriteBtn = this.doc.getElementById("favorite-btn");
    this.favoriteText = this.doc.getElementById("favorite-text");

    this._bindEvents();
  }

  /**
   * Binds user interaction events.
   * @private
   */
  _bindEvents() {
    if (this.newQuoteBtn) {
      this.newQuoteBtn.addEventListener("click", () => this.displayNewQuote());
    }

    if (this.favoriteBtn) {
      this.favoriteBtn.addEventListener("click", () => this.toggleFavorite());
    }

    if (this.quoteCard) {
      this.quoteCard.addEventListener("animationend", () => {
        this.quoteCard.classList.remove("shimmer-active");
      });
    }
  }

  /**
   * Selects and renders an initial quote from the catalog.
   */
  init() {
    this.displayNewQuote();
  }

  /**
   * Selects and displays a new random quote, excluding the currently displayed quote.
   */
  displayNewQuote() {
    const excludeId = this.currentQuote ? this.currentQuote.id : null;
    const nextQuote = this.quoteService.getRandomQuote(excludeId);
    this.currentQuote = nextQuote;
    this._renderCurrentQuote();
  }

  /**
   * Toggles the favorite status of the currently displayed quote.
   */
  toggleFavorite() {
    if (!this.currentQuote) return;

    const isFav = this.favoriteStore.toggleFavorite(this.currentQuote.id);
    this._updateFavoriteUI(isFav);
  }

  /**
   * Renders the current quote content, updates favorite state, and triggers shimmer if favorited.
   * @private
   */
  _renderCurrentQuote() {
    if (!this.currentQuote) return;

    if (this.quoteText) {
      this.quoteText.textContent = this.currentQuote.text;
    }

    if (this.quoteAuthor) {
      this.quoteAuthor.textContent = this.currentQuote.author || "Unknown";
    }

    const isFav = this.favoriteStore.isFavorite(this.currentQuote.id);
    this._updateFavoriteUI(isFav);
    this._handleShimmerEffect(isFav);
  }

  /**
   * Triggers or clears the diagonal shimmer animation based on favorite status.
   * @param {boolean} isFav
   * @private
   */
  _handleShimmerEffect(isFav) {
    if (!this.quoteCard) return;

    this.quoteCard.classList.remove("shimmer-active");

    if (isFav) {
      // Force DOM reflow to allow clean re-animation if consecutive rolls are favorited
      if (typeof this.quoteCard.offsetWidth === "number") {
        void this.quoteCard.offsetWidth;
      }
      this.quoteCard.classList.add("shimmer-active");
    }
  }

  /**
   * Updates the visual and accessible state of the favorite button.
   * @param {boolean} isFav
   * @private
   */
  _updateFavoriteUI(isFav) {
    if (!this.favoriteBtn) return;

    this.favoriteBtn.setAttribute("aria-pressed", isFav ? "true" : "false");
    this.favoriteBtn.setAttribute(
      "aria-label",
      isFav ? "Remove quote from favorites" : "Add quote to favorites"
    );

    if (this.favoriteText) {
      this.favoriteText.textContent = isFav ? "Favorited" : "Favorite";
    }
  }
}

// Bootstrap automatically in browser environment
if (typeof window !== "undefined" && typeof document !== "undefined") {
  const initApp = () => {
    const quoteService = new QuoteService();
    const favoriteStore = new FavoriteStore();
    const app = new QuoteApp(quoteService, favoriteStore, document);
    app.init();
    window.__quoteApp = app;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}
