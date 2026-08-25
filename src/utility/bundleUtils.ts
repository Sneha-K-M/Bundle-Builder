import type { BundleItem } from "../types/product";

export function getItemQuantity(
  items: BundleItem[],
  productId: string,
  variantId?: string
): number {
  const item = items.find(
    (item) =>
      item.productId === productId &&
      item.variantId === variantId
  );

  return item?.quantity ?? 0;
}

export function getProductQuantity(
  items: BundleItem[],
  productId: string
): number {
  return items
    .filter((item) => item.productId === productId)
    .reduce((total, item) => total + item.quantity, 0);
}