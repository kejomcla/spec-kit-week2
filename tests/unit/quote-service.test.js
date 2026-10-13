import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { QuoteService } from "../../src/services/quote-service.js";

describe("QuoteService", () => {
  const sampleCatalog = [
    { id: "q-1", text: "Quote one", author: "Author One" },
    { id: "q-2", text: "Quote two", author: "Author Two" },
    { id: "q-3", text: "Quote three", author: "Author Three" }
  ];

  it("should initialize with default catalog if none provided", () => {
    const service = new QuoteService();
    const all = service.getAllQuotes();
    assert.ok(all.length >= 20, "Default catalog should have at least 20 quotes");
    assert.ok(all.every(q => q.id && q.text && q.author), "All default quotes must have id, text, and author");
  });

  it("should initialize with custom catalog", () => {
    const service = new QuoteService(sampleCatalog);
    assert.equal(service.getAllQuotes().length, 3);
  });

  it("should retrieve quote by id", () => {
    const service = new QuoteService(sampleCatalog);
    const quote = service.getQuoteById("q-2");
    assert.deepEqual(quote, { id: "q-2", text: "Quote two", author: "Author Two" });
    assert.equal(service.getQuoteById("non-existent"), undefined);
  });

  it("should return a random quote from catalog", () => {
    const service = new QuoteService(sampleCatalog);
    const quote = service.getRandomQuote();
    assert.ok(sampleCatalog.some(q => q.id === quote.id), "Quote must belong to catalog");
  });

  it("should not return the excluded quote ID when more than one quote exists", () => {
    const service = new QuoteService(sampleCatalog);
    const excludeId = "q-2";

    // Run 50 selections to verify statistical certainty of non-repetition
    for (let i = 0; i < 50; i++) {
      const quote = service.getRandomQuote(excludeId);
      assert.notEqual(quote.id, excludeId, `Selected quote ID ${quote.id} must not equal excluded ID ${excludeId}`);
    }
  });

  it("should return the single quote if catalog length is 1 even with excludeId", () => {
    const singleCatalog = [{ id: "solo", text: "Solo quote", author: "Solo Author" }];
    const service = new QuoteService(singleCatalog);
    const quote = service.getRandomQuote("solo");
    assert.equal(quote.id, "solo");
  });

  it("should throw an error if catalog is empty", () => {
    assert.throws(() => new QuoteService([]), /empty/i);
  });
});
