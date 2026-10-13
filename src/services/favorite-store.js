export const STORAGE_KEY = "qotd_favorites_v1";

/**
 * Manages persistence and state of favorite quote IDs with localStorage and in-memory fallback.
 */
export class FavoriteStore {
  /**
   * @param {Storage | {getItem: Function, setItem: Function, removeItem: Function}} [storage]
   */
  constructor(storage = null) {
    this._storage = storage !== null ? storage : (typeof localStorage !== "undefined" ? localStorage : null);
    this._favoriteIds = new Set();
    this._load();
  }

  /**
   * Safely loads stored favorites from storage backend.
   * @private
   */
  _load() {
    if (!this._storage) return;

    try {
      const raw = this._storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this._favoriteIds = new Set(parsed.filter(id => typeof id === "string"));
        }
      }
    } catch {
      // In case of Storage errors (e.g. disabled or restricted), fall back to in-memory set
      this._favoriteIds = new Set();
    }
  }

  /**
   * Safely persists current favorites to storage backend.
   * @private
   */
  _persist() {
    if (!this._storage) return;

    try {
      const serialized = JSON.stringify(Array.from(this._favoriteIds));
      this._storage.setItem(STORAGE_KEY, serialized);
    } catch {
      // In case storage throws (quota exceeded or access denied), preserve in-memory state
    }
  }

  /**
   * Checks whether a quote ID is favorited.
   * @param {string} quoteId
   * @returns {boolean}
   */
  isFavorite(quoteId) {
    return this._favoriteIds.has(quoteId);
  }

  /**
   * Toggles the favorite status for a quote ID.
   * @param {string} quoteId
   * @returns {boolean} Returns true if favorited, false if removed
   */
  toggleFavorite(quoteId) {
    if (this._favoriteIds.has(quoteId)) {
      this._favoriteIds.delete(quoteId);
      this._persist();
      return false;
    } else {
      this._favoriteIds.add(quoteId);
      this._persist();
      return true;
    }
  }

  /**
   * Returns a list of all favorited quote IDs.
   * @returns {string[]}
   */
  getFavorites() {
    return Array.from(this._favoriteIds);
  }

  /**
   * Clears all stored favorites.
   */
  clear() {
    this._favoriteIds.clear();
    this._persist();
  }
}
