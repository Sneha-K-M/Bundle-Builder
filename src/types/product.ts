export type StepId =
  | "cameras"
  | "plan"
  | "sensors"
  | "protection";

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  image?: string;
  quantity: number;
}

export interface Product {
  id: string;
  category: StepId;
  name: string;
  description: string;
  image: string;

  badge?: {
    text: string;
  };

  variants?: ProductVariant[];

  price: number;
  compareAtPrice?: number;

  quantity?: number;

  learnMore?: string;
}

export interface BundleItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface BundleState {
  items: BundleItem[];
  selectedVariants: Record<string, string>;
  openStep: StepId;
}