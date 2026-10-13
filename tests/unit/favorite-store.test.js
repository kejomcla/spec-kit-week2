import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { FavoriteStore, STORAGE_KEY } from "../../src/services/favorite-store.js";

/**
 * In-memory mock implementing Web Storage API
 */
class MockStorage {
  constructor(shouldThrow = false) {
    this._data = new Map();
    this.shouldThrow = shouldThrow;
  }

  getItem(key) {
    if (this.shouldThrow) throw new Error("SecurityError: Access denied");
    return this._data.has(key) ? this._data.get(key) : null;
  }

  setItem(key, value) {
    if (this.shouldThrow) throw new Error("QuotaExceededError");
    this._data.set(key, String(value));
  }

  removeItem(key) {
    if (this.shouldThrow) throw new Error("SecurityError: Access denied");
    this._data.delete(key);
  }

  clear() {
    this._data.clear();
  }
}

describe("FavoriteStore", () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  it("should initialize empty when storage has no entry", () => {
    const store = new FavoriteStore(mockStorage);
    assert.deepEqual(store.getFavorites(), []);
    assert.equal(store.isFavorite("q-1"), false);
  });

  it("should load existing favorites from storage on init", () => {
    mockStorage.setItem(STORAGE_KEY, JSON.stringify(["q-1", "q-3"]));
    const store = new FavoriteStore(mockStorage);
    assert.deepEqual(store.getFavorites().sort(), ["q-1", "q-3"]);
    assert.equal(store.isFavorite("q-1"), true);
    assert.equal(store.isFavorite("q-2"), false);
    assert.equal(store.isFavorite("q-3"), true);
  });

  it("should toggle favorite from false to true and persist", () => {
    const store = new FavoriteStore(mockStorage);
    const result = store.toggleFavorite("q-1");
    assert.equal(result, true);
    assert.equal(store.isFavorite("q-1"), true);
    assert.equal(mockStorage.getItem(STORAGE_KEY), JSON.stringify(["q-1"]));
  });

  it("should toggle favorite from true to false and persist", () => {
    mockStorage.setItem(STORAGE_KEY, JSON.stringify(["q-1"]));
    const store = new FavoriteStore(mockStorage);
    const result = store.toggleFavorite("q-1");
    assert.equal(result, false);
    assert.equal(store.isFavorite("q-1"), false);
    assert.equal(mockStorage.getItem(STORAGE_KEY), JSON.stringify([]));
  });

  it("should handle corrupted storage JSON gracefully", () => {
    mockStorage.setItem(STORAGE_KEY, "invalid-json{not-array");
    const store = new FavoriteStore(mockStorage);
    assert.deepEqual(store.getFavorites(), []);
  });

  it("should handle non-array storage JSON gracefully", () => {
    mockStorage.setItem(STORAGE_KEY, JSON.stringify({ favorite: "q-1" }));
    const store = new FavoriteStore(mockStorage);
    assert.deepEqual(store.getFavorites(), []);
  });

  it("should operate in-memory if storage throws errors", () => {
    const failingStorage = new MockStorage(true);
    const store = new FavoriteStore(failingStorage);

    assert.equal(store.isFavorite("q-1"), false);
    assert.doesNotThrow(() => {
      const added = store.toggleFavorite("q-1");
      assert.equal(added, true);
    });
    assert.equal(store.isFavorite("q-1"), true);
    assert.deepEqual(store.getFavorites(), ["q-1"]);
  });

  it("should clear all favorites", () => {
    mockStorage.setItem(STORAGE_KEY, JSON.stringify(["q-1", "q-2"]));
    const store = new FavoriteStore(mockStorage);
    store.clear();
    assert.deepEqual(store.getFavorites(), []);
    assert.equal(mockStorage.getItem(STORAGE_KEY), JSON.stringify([]));
  });
});
