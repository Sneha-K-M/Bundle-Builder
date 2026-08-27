import {
  BASE_VARIANT_ID,
  type ActiveVariants,
  type Product,
  type Selections,
  type Step,
} from "../types/bundle";
import { lineKey, resolveVariantId, variantIdsFor } from "./line";
import { clampQuantity } from "./money";

export function emptySelections(): Selections {
  return new Map();
}

export function cloneSelections(selections: Selections): Selections {
  return new Map(selections);
}

export function getLineQuantity(
  selections: Selections,
  productId: string,
  variantId: string
): number {
  return selections.get(lineKey(productId, variantId)) ?? 0;
}

export function getProductQuantity(product: Product, selections: Selections): number {
  return variantIdsFor(product).reduce(
    (sum, variantId) => sum + getLineQuantity(selections, product.id, variantId),
    0
  );
}

export function productHasSelection(product: Product, selections: Selections): boolean {
  return getProductQuantity(product, selections) > 0;
}

export function activeVariantFor(product: Product, activeVariants: ActiveVariants): string {
  return resolveVariantId(product, activeVariants.get(product.id));
}

function quantityBounds(product: Product | undefined, current: number): { min: number; max: number } {
  const min = product?.minQuantity ?? 0;
  if (product?.locked) return { min, max: Math.max(min, current) };
  return { min, max: Number.POSITIVE_INFINITY };
}

export function setLineQuantity(
  selections: Selections,
  product: Product | undefined,
  productId: string,
  variantId: string,
  quantity: number
): Selections {
  const key = lineKey(productId, variantId);
  const current = selections.get(key) ?? 0;
  const { min, max } = quantityBounds(product, current);
  const nextQty = clampQuantity(quantity, min, max);
  const next = cloneSelections(selections);
  next.set(key, nextQty);
  return next;
}

export function adjustLineQuantity(
  selections: Selections,
  product: Product | undefined,
  productId: string,
  variantId: string,
  delta: number
): Selections {
  const current = getLineQuantity(selections, productId, variantId);
  return setLineQuantity(selections, product, productId, variantId, current + delta);
}

export function selectExclusiveProduct(
  selections: Selections,
  step: Step,
  product: Product,
  variantId?: string
): Selections {
  const next = cloneSelections(selections);
  for (const sibling of step.products) {
    for (const id of variantIdsFor(sibling)) {
      next.set(lineKey(sibling.id, id), 0);
    }
  }
  const resolved = resolveVariantId(product, variantId);
  next.set(lineKey(product.id, resolved), Math.max(1, product.minQuantity ?? 0));
  return next;
}

export function setActiveVariantMap(
  activeVariants: ActiveVariants,
  productId: string,
  variantId: string
): ActiveVariants {
  const next = new Map(activeVariants);
  next.set(productId, variantId);
  return next;
}

export function buildSeedState(steps: Step[]): {
  selections: Selections;
  activeVariants: ActiveVariants;
} {
  const selections: Selections = new Map();
  const activeVariants: ActiveVariants = new Map();

  for (const step of steps) {
    for (const product of step.products) {
      const seed = product.seedQuantities ?? {};
      for (const [variantId, qty] of Object.entries(seed)) {
        const resolved =
          variantId === BASE_VARIANT_ID ? BASE_VARIANT_ID : resolveVariantId(product, variantId);
        selections.set(lineKey(product.id, resolved), clampQuantity(qty, product.minQuantity ?? 0));
      }
      const firstSeeded = Object.keys(seed)[0];
      activeVariants.set(
        product.id,
        firstSeeded ? resolveVariantId(product, firstSeeded) : resolveVariantId(product)
      );
    }
  }

  return { selections, activeVariants };
}
