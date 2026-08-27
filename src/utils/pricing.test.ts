import { describe, expect, it } from "vitest";
import { productsData } from "../data/catalog";
import { BASE_VARIANT_ID } from "../types/bundle";
import { lineKey } from "../utils/line";
import {
  SHIPPING_COMPARE_AT_CENTS,
  buildCatalog,
  computeTotals,
  countSelectedInStep,
} from "../utils/pricing";
import { buildSeedState } from "../utils/selections";

describe("pricing", () => {
  const { catalog } = buildCatalog(productsData);
  const seed = buildSeedState(productsData.steps);

  it("matches the seeded design totals", () => {
    const totals = computeTotals(seed.selections, catalog, productsData.reviewCategoryOrder);

    expect(totals.totalCents).toBe(18789);
    expect(totals.originalTotalCents).toBe(23679 + SHIPPING_COMPARE_AT_CENTS);
    expect(totals.savingsCents).toBe(4890);
    expect(totals.financingPerMonthCents).toBe(Math.round(18789 / 12));
    expect(totals.lineItemsByCategory.Cameras).toHaveLength(2);
    expect(totals.lineItemsByCategory.Sensors).toHaveLength(2);
    expect(totals.lineItemsByCategory.Accessories).toHaveLength(1);
    expect(totals.lineItemsByCategory.Plan).toHaveLength(1);
  });

  it("recalculates when a line quantity changes", () => {
    const next = new Map(seed.selections);
    next.set(lineKey("cam-v4", "white"), 2);
    const totals = computeTotals(next, catalog, productsData.reviewCategoryOrder);
    expect(totals.totalCents).toBe(18789 + 2798);
  });

  it("shows each selected variant as its own review line", () => {
    const selections = new Map(seed.selections);
    selections.set(lineKey("cam-v4", "white"), 2);
    selections.set(lineKey("cam-v4", "grey"), 3);
    const totals = computeTotals(selections, catalog, productsData.reviewCategoryOrder);
    const cameras = totals.lineItemsByCategory.Cameras;
    const v4Lines = cameras.filter((item) => item.product.id === "cam-v4");
    expect(v4Lines).toHaveLength(2);
    expect(v4Lines.map((item) => item.variant.id).sort()).toEqual(["grey", "white"]);
  });

  it("counts distinct selected products in a step, not total units", () => {
    const cameras = productsData.steps[0];
    expect(countSelectedInStep(cameras, seed.selections)).toBe(2);
  });

  it("ignores unknown catalog keys", () => {
    const selections = new Map(seed.selections);
    selections.set(lineKey("missing-product", BASE_VARIANT_ID), 4);
    const totals = computeTotals(selections, catalog, productsData.reviewCategoryOrder);
    expect(totals.totalCents).toBe(18789);
  });
});
