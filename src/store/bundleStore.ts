import { create } from "zustand";
import type { BundleItem, BundleState, StepId } from "../types/product";

interface BundleActions {
  setQuantity: (
    productId: string,
    quantity: number,
    variantId?: string
  ) => void;

  increment: (productId: string, variantId?: string) => void;

  decrement: (productId: string, variantId?: string) => void;

  selectVariant: (productId: string, variantId: string) => void;

  setOpenStep: (step: StepId) => void;
}

type BundleStore = BundleState & BundleActions;

const initialItems: BundleItem[] = [
  {
    productId: "wyze-cam-v4",
    variantId: "white",
    quantity: 1,
  },
  {
    productId: "wyze-cam-pan-v3",
    variantId: "white",
    quantity: 2,
  },
  {
    productId: "wyze-sense-motion-sensor",
    quantity: 2,
  },
  {
    productId: "wyze-sense-hub",
    quantity: 1,
  },
  {
    productId: "wyze-microsd-card",
    quantity: 2,
  },
  {
    productId: "cam-unlimited",
    quantity: 1,
  },
];

export const useBundleStore = create<BundleStore>((set) => ({
  items: initialItems,

  selectedVariants: {
    "wyze-cam-v4": "white",
    "wyze-cam-pan-v3": "white",
    "wyze-cam-floodlight-v2": "white",
    "wyze-battery-cam-pro": "white",
  },

  openStep: "cameras",

  setQuantity: (productId, quantity, variantId) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId
      );

      // Don't allow negative quantities.
      const safeQuantity = Math.max(0, quantity);

      if (safeQuantity === 0) {
        return {
          items: state.items.filter(
            (_, index) => index !== existingIndex
          ),
        };
      }

      if (existingIndex === -1) {
        return {
          items: [
            ...state.items,
            {
              productId,
              variantId,
              quantity: safeQuantity,
            },
          ],
        };
      }

      const updatedItems = [...state.items];

      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: safeQuantity,
      };

      return {
        items: updatedItems,
      };
    });
  },

  increment: (productId, variantId) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId
      );

      const currentQuantity = existingItem?.quantity ?? 0;

      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId
      );

      if (existingIndex === -1) {
        return {
          items: [
            ...state.items,
            {
              productId,
              variantId,
              quantity: 1,
            },
          ],
        };
      }

      const updatedItems = [...state.items];

      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: currentQuantity + 1,
      };

      return {
        items: updatedItems,
      };
    });
  },

  decrement: (productId, variantId) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId
      );

      if (!existingItem) {
        return state;
      }

      const newQuantity = existingItem.quantity - 1;

      if (newQuantity <= 0) {
        return {
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId
              )
          ),
        };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId &&
          item.variantId === variantId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        ),
      };
    });
  },

  selectVariant: (productId, variantId) => {
    set((state) => ({
      selectedVariants: {
        ...state.selectedVariants,
        [productId]: variantId,
      },
    }));
  },

  setOpenStep: (step) => {
    set({
      openStep: step,
    });
  },
}));