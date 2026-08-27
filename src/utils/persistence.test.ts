import { describe, expect, it } from "vitest";
import { productsData } from "../data/catalog";
import { lineKey } from "./line";
import { buildCatalog } from "./pricing";
import { STORAGE_KEY, clearSavedBundle, loadSavedBundle, saveBundle } from "./persistence";
import { buildSeedState } from "./selections";

describe("persistence", () => {
  const { catalog } = buildCatalog(productsData);

  it("round-trips bundle selections and active variants", () => {
    const seed = buildSeedState(productsData.steps);
    const selections = new Map(seed.selections);
    selections.set(lineKey("cam-v4", "grey"), 3);
    const activeVariants = new Map(seed.activeVariants);
    activeVariants.set("cam-v4", "grey");

    expect(saveBundle({ selections, activeVariants })).toBe(true);
    const loaded = loadSavedBundle(catalog);
    expect(loaded).not.toBeNull();
    expect(loaded?.selections.get(lineKey("cam-v4", "grey"))).toBe(3);
    expect(loaded?.activeVariants.get("cam-v4")).toBe("grey");
  });

  it("returns null for malformed stored JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-json");
    expect(loadSavedBundle(catalog)).toBeNull();
  });

  it("keeps valid lines and skips unknown catalog keys", () => {
    const seed = buildSeedState(productsData.steps);
    const validKey = lineKey("cam-v4", "white");
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selections: [
          [validKey, 2],
          ["ghost::base", 4],
        ],
        activeVariants: [
          ["cam-v4", "white"],
          ["ghost", "base"],
        ],
        savedAt: "2026-01-01T00:00:00.000Z",
      })
    );
    const loaded = loadSavedBundle(catalog);
    expect(loaded?.selections.get(validKey)).toBe(2);
    expect(loaded?.selections.has("ghost::base")).toBe(false);
    expect(loaded?.activeVariants.get("cam-v4")).toBe("white");
    expect(loaded?.activeVariants.has("ghost")).toBe(false);
    expect(seed.selections.get(validKey)).toBe(1);
  });

  it("returns null when every stored line is unknown", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selections: [["ghost::base", 2]],
        activeVariants: [["ghost", "base"]],
        savedAt: "2026-01-01T00:00:00.000Z",
      })
    );
    expect(loadSavedBundle(catalog)).toBeNull();
  });

  it("clears saved state", () => {
    const seed = buildSeedState(productsData.steps);
    saveBundle(seed);
    clearSavedBundle();
    expect(loadSavedBundle(catalog)).toBeNull();
  });
});
