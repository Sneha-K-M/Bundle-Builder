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

export function formatCurrency(value: number): string {
  if (value === 0) return "$0.00";
  return `$${value.toFixed(2)}`;
}

export function lineKey(productId: string, variantId?: string): string {
  return `${productId}::${variantId ?? "base"}`;
}

export function buildCatalog(stepsData: ProductsData): {
  catalog: Catalog;
  stepByProductId: Map<string, Step>;
} {
  const catalog: Catalog = new Map();
  const stepByProductId = new Map<string, Step>();

  for (const step of stepsData.steps) {
    for (const product of step.products) {
      stepByProductId.set(product.id, step);
      const variantList: ProductVariant[] = product.variants.length
        ? product.variants
        : [{ id: "base", label: null }];
      for (const variant of variantList) {
        const entry: CatalogEntry = { product, variant, step };
        catalog.set(lineKey(product.id, variant.id), entry);
      }
    }
  }

  return { catalog, stepByProductId };
}

export function computeTotals(selections: Selections, catalog: Catalog): BundleTotals {
  let subtotal = 0;
  let originalSubtotal = 0;
  const lineItemsByCategory: Record<string, LineItem[]> = {};

  for (const [key, quantity] of selections.entries()) {
    if (!quantity) continue;
    const entry = catalog.get(key);
    if (!entry) continue;
    const { product, variant, step } = entry;

    const unitPrice = product.price;
    const unitOriginal = product.originalPrice ?? product.price;

    subtotal += unitPrice * quantity;
    originalSubtotal += unitOriginal * quantity;

    const category = step.category;
    if (!lineItemsByCategory[category]) lineItemsByCategory[category] = [];
    lineItemsByCategory[category].push({
      key,
      product,
      variant,
      quantity,
      unitPrice,
      unitOriginal,
      lineTotal: unitPrice * quantity,
      lineOriginal: unitOriginal * quantity,
      selectionType: step.selectionType ?? "multi",
    });
  }

  const savings = Math.max(0, originalSubtotal - subtotal);
  const financingPerMonth = subtotal / 12;

  return {
    subtotal,
    originalSubtotal,
    savings,
    financingPerMonth,
    lineItemsByCategory,
  };
}

export function countSelectedInStep(step: Step, selections: Selections): number {
  const seen = new Set<string>();
  for (const product of step.products) {
    const variantList: ProductVariant[] = product.variants.length
      ? product.variants
      : [{ id: "base", label: null }];
    for (const variant of variantList) {
      const qty = selections.get(lineKey(product.id, variant.id)) ?? 0;
      if (qty > 0) seen.add(product.id);
    }
  }
  return seen.size;
}
