import type {
  BundleTotals,
  Catalog,
  CatalogEntry,
  LineItem,
  ProductVariant,
  ProductsData,
  Selections,
  Step,
} from "../types/bundle";
import { BASE_VARIANT_ID } from "../types/bundle";
import { lineKey, variantIdsFor } from "./line";
import { dollarsToCents } from "./money";

export { lineKey } from "./line";

export const SHIPPING_COMPARE_AT_CENTS = 599;
export const SHIPPING_CENTS = 0;
export const FINANCING_MONTHS = 12;

export function buildCatalog(stepsData: ProductsData): {
  catalog: Catalog;
  stepByProductId: Map<string, Step>;
  productById: Map<string, Step["products"][number]>;
} {
  const catalog: Catalog = new Map();
  const stepByProductId = new Map<string, Step>();
  const productById = new Map<string, Step["products"][number]>();

  for (const step of stepsData.steps) {
    for (const product of step.products) {
      stepByProductId.set(product.id, step);
      productById.set(product.id, product);
      const variantList: ProductVariant[] = product.variants.length
        ? product.variants
        : [{ id: BASE_VARIANT_ID, label: null }];
      for (const variant of variantList) {
        const entry: CatalogEntry = { product, variant, step };
        catalog.set(lineKey(product.id, variant.id), entry);
      }
    }
  }

  return { catalog, stepByProductId, productById };
}

export function computeTotals(
  selections: Selections,
  catalog: Catalog,
  categoryOrder: readonly string[] = []
): BundleTotals {
  let subtotalCents = 0;
  let originalSubtotalCents = 0;
  const grouped: Record<string, LineItem[]> = {};

  for (const [key, quantity] of selections.entries()) {
    if (!quantity) continue;
    const entry = catalog.get(key);
    if (!entry) continue;
    const { product, variant, step } = entry;

    const unitPriceCents = dollarsToCents(product.price);
    const unitOriginalCents = dollarsToCents(product.originalPrice ?? product.price);

    subtotalCents += unitPriceCents * quantity;
    originalSubtotalCents += unitOriginalCents * quantity;

    const category = step.category;
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({
      key,
      product,
      variant,
      quantity,
      unitPriceCents,
      unitOriginalCents,
      lineTotalCents: unitPriceCents * quantity,
      lineOriginalCents: unitOriginalCents * quantity,
      selectionType: step.selectionType ?? "multi",
    });
  }

  const lineItemsByCategory: Record<string, LineItem[]> = {};
  const seen = new Set<string>();
  for (const category of categoryOrder) {
    if (grouped[category]?.length) {
      lineItemsByCategory[category] = grouped[category];
      seen.add(category);
    }
  }
  for (const [category, items] of Object.entries(grouped)) {
    if (!seen.has(category)) lineItemsByCategory[category] = items;
  }

  const savingsCents = Math.max(0, originalSubtotalCents - subtotalCents);
  const totalCents = subtotalCents + SHIPPING_CENTS;
  const originalTotalCents = originalSubtotalCents + SHIPPING_COMPARE_AT_CENTS;
  const financingPerMonthCents = Math.round(totalCents / FINANCING_MONTHS);

  return {
    subtotalCents,
    originalSubtotalCents,
    shippingCents: SHIPPING_CENTS,
    shippingOriginalCents: SHIPPING_COMPARE_AT_CENTS,
    totalCents,
    originalTotalCents,
    savingsCents,
    financingPerMonthCents,
    lineItemsByCategory,
  };
}

export function countSelectedInStep(step: Step, selections: Selections): number {
  let count = 0;
  for (const product of step.products) {
    const selected = variantIdsFor(product).some(
      (variantId) => (selections.get(lineKey(product.id, variantId)) ?? 0) > 0
    );
    if (selected) count += 1;
  }
  return count;
}

export function hasAnySelection(selections: Selections): boolean {
  for (const quantity of selections.values()) {
    if (quantity > 0) return true;
  }
  return false;
}
