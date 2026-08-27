import { BASE_VARIANT_ID, type Product } from "../types/bundle";

export function lineKey(productId: string, variantId?: string): string {
  return `${productId}::${variantId ?? BASE_VARIANT_ID}`;
}

export function variantIdsFor(product: Product): string[] {
  if (product.variants.length === 0) return [BASE_VARIANT_ID];
  return product.variants.map((variant) => variant.id);
}

export function resolveVariantId(product: Product, variantId?: string): string {
  const ids = variantIdsFor(product);
  if (variantId && ids.includes(variantId)) return variantId;
  if (product.defaultVariant && ids.includes(product.defaultVariant)) {
    return product.defaultVariant;
  }
  return ids[0] ?? BASE_VARIANT_ID;
}
