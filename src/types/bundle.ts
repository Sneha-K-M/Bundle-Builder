export type StepId = "cameras" | "plan" | "sensors" | "accessories";

export type StepIconName = "camera" | "shield" | "sensor" | "grid";

export type SelectionType = "multi" | "single";

export type SaveStatus = "idle" | "saved" | "error" | "restored";

export const BASE_VARIANT_ID = "base";

export const STEP_IDS: readonly StepId[] = ["cameras", "plan", "sensors", "accessories"];

export interface ProductVariant {
  id: string;
  label: string | null;
  swatch?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  learnMoreUrl: string;
  image: string;
  badge: string | null;
  originalPrice: number | null;
  price: number;
  billingSuffix?: string;
  variants: ProductVariant[];
  defaultVariant: string | null;
  seedQuantities: Record<string, number>;
  locked?: boolean;
  minQuantity?: number;
  nameAccent?: string;
}

export interface Step {
  id: StepId;
  stepNumber: number;
  title: string;
  icon: StepIconName;
  category: string;
  nextLabel: string | null;
  selectionType?: SelectionType;
  products: Product[];
}

export interface ProductsData {
  reviewCategoryOrder: string[];
  steps: Step[];
}

/** Unique identity for a selected line: `productId::variantId`. */
export type LineKey = string;

export type Selections = Map<LineKey, number>;

export type ActiveVariants = Map<string, string>;

export interface CatalogEntry {
  product: Product;
  variant: ProductVariant;
  step: Step;
}

export type Catalog = Map<LineKey, CatalogEntry>;

export interface LineItem {
  key: LineKey;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPriceCents: number;
  unitOriginalCents: number;
  lineTotalCents: number;
  lineOriginalCents: number;
  selectionType: SelectionType;
}

export interface BundleTotals {
  subtotalCents: number;
  originalSubtotalCents: number;
  shippingCents: number;
  shippingOriginalCents: number;
  totalCents: number;
  originalTotalCents: number;
  savingsCents: number;
  financingPerMonthCents: number;
  lineItemsByCategory: Record<string, LineItem[]>;
}

export interface SavedBundle {
  selections: Selections;
  activeVariants: ActiveVariants;
  savedAt: string | null;
}

export type QuantityChangeHandler = (
  product: Product,
  variantId: string,
  delta: number
) => void;

export type VariantSelectHandler = (productId: string, variantId: string) => void;

export type ExclusiveSelectHandler = (
  product: Product,
  step: Step,
  variantId?: string
) => void;
