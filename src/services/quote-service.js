import { quotes as defaultQuotes } from "../data/quotes.js";

/**
 * Service managing access and non-repeating random selection from the quote catalog.
 */
export class QuoteService {
  /**
   * @param {Array<{id: string, text: string, author: string}>} [catalog]
   */
  constructor(catalog) {
    const list = catalog || defaultQuotes;
    if (!list || list.length === 0) {
      throw new Error("Quote catalog cannot be empty.");
    }
    this._catalog = Object.freeze([...list]);
  }

  /**
   * Returns all quotes in the catalog.
   * @returns {ReadonlyArray<{id: string, text: string, author: string}>}
   */
  getAllQuotes() {
    return this._catalog;
  }

  /**
   * Retrieves a quote by its identifier.
   * @param {string} id
   * @returns {{id: string, text: string, author: string} | undefined}
   */
  getQuoteById(id) {
    return this._catalog.find(q => q.id === id);
  }

  /**
   * Returns a random quote from the catalog.
   * If excludeId is provided and the catalog contains more than 1 quote,
   * the returned quote is guaranteed to have a different id than excludeId.
   *
   * @param {string | null} [excludeId]
   * @returns {{id: string, text: string, author: string}}
   */
  getRandomQuote(excludeId = null) {
    if (this._catalog.length === 1) {
      return this._catalog[0];
    }

    const eligible = excludeId
      ? this._catalog.filter(q => q.id !== excludeId)
      : this._catalog;

    const pool = eligible.length > 0 ? eligible : this._catalog;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }
}
