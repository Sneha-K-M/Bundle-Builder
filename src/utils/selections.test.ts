import { describe, expect, it } from "vitest";
import { BASE_VARIANT_ID, type Product, type Step } from "../types/bundle";
import { lineKey } from "../utils/line";
import { dollarsToCents } from "../utils/money";
import {
  adjustLineQuantity,
  buildSeedState,
  getLineQuantity,
  selectExclusiveProduct,
  setActiveVariantMap,
} from "../utils/selections";

function camera(overrides: Partial<Product> = {}): Product {
  return {
    id: "cam-v4",
    name: "Wyze Cam v4",
    description: "The clearest Wyze Cam ever made.",
    learnMoreUrl: "https://example.com",
    image: "cam-v4",
    badge: "Save 22%",
    originalPrice: 35.98,
    price: 27.98,
    variants: [
      { id: "white", label: "White", swatch: "#f5f5f0" },
      { id: "grey", label: "Grey", swatch: "#8a8a86" },
      { id: "black", label: "Black", swatch: "#232323" },
    ],
    defaultVariant: "white",
    seedQuantities: { white: 1 },
    ...overrides,
  };
}

function planStep(): Step {
  return {
    id: "plan",
    stepNumber: 2,
    title: "Choose your plan",
    icon: "shield",
    category: "Plan",
    nextLabel: "Next",
    selectionType: "single",
    products: [
      {
        id: "cam-unlimited",
        name: "Cam Unlimited",
        description: "Unlimited cloud storage",
        learnMoreUrl: "https://example.com",
        image: "cam-unlimited",
        badge: null,
        originalPrice: 12.99,
        price: 9.99,
        billingSuffix: "/mo",
        variants: [],
        defaultVariant: null,
        seedQuantities: { [BASE_VARIANT_ID]: 1 },
      },
      {
        id: "cam-protect-basic",
        name: "Cam Protect Basic",
        description: "14-day event video history",
        learnMoreUrl: "https://example.com",
        image: "cam-protect-basic",
        badge: null,
        originalPrice: null,
        price: 2.99,
        billingSuffix: "/mo",
        variants: [],
        defaultVariant: null,
        seedQuantities: {},
      },
    ],
  };
}

describe("variant quantities", () => {
  it("keeps Red quantity when switching the active variant to Blue", () => {
    const product = camera();
    let selections = new Map<string, number>([[lineKey(product.id, "white"), 2]]);
    let active = new Map<string, string>([[product.id, "white"]]);

    active = setActiveVariantMap(active, product.id, "grey");

    expect(getLineQuantity(selections, product.id, "white")).toBe(2);
    expect(getLineQuantity(selections, product.id, "grey")).toBe(0);
    expect(active.get(product.id)).toBe("grey");

    selections = adjustLineQuantity(selections, product, product.id, "grey", 3);
    expect(getLineQuantity(selections, product.id, "white")).toBe(2);
    expect(getLineQuantity(selections, product.id, "grey")).toBe(3);
  });

  it("never lets quantity go below zero", () => {
    const product = camera();
    const start = new Map<string, number>([[lineKey(product.id, "white"), 1]]);
    const next = adjustLineQuantity(start, product, product.id, "white", -5);
    expect(getLineQuantity(next, product.id, "white")).toBe(0);
  });

  it("does not increment a locked product past its current quantity", () => {
    const hub = camera({
      id: "sense-hub",
      locked: true,
      minQuantity: 1,
      variants: [],
      defaultVariant: null,
      seedQuantities: { [BASE_VARIANT_ID]: 1 },
    });
    const start = new Map<string, number>([[lineKey(hub.id, BASE_VARIANT_ID), 1]]);
    const next = adjustLineQuantity(start, hub, hub.id, BASE_VARIANT_ID, 1);
    expect(getLineQuantity(next, hub.id, BASE_VARIANT_ID)).toBe(1);
  });

  it("replaces siblings when selecting an exclusive product", () => {
    const step = planStep();
    const [unlimited, basic] = step.products;
    const start = new Map<string, number>([[lineKey(unlimited.id, BASE_VARIANT_ID), 1]]);
    const next = selectExclusiveProduct(start, step, basic);
    expect(getLineQuantity(next, unlimited.id, BASE_VARIANT_ID)).toBe(0);
    expect(getLineQuantity(next, basic.id, BASE_VARIANT_ID)).toBe(1);
  });

  it("seeds variant-aware quantities from catalog data", () => {
    const product = camera({ seedQuantities: { white: 1 } });
    const pan = camera({
      id: "cam-pan-v3",
      seedQuantities: { white: 2 },
      variants: [
        { id: "white", label: "White" },
        { id: "black", label: "Black" },
      ],
    });
    const { selections, activeVariants } = buildSeedState([
      {
        id: "cameras",
        stepNumber: 1,
        title: "Choose your cameras",
        icon: "camera",
        category: "Cameras",
        nextLabel: "Next",
        products: [product, pan],
      },
    ]);

    expect(getLineQuantity(selections, product.id, "white")).toBe(1);
    expect(getLineQuantity(selections, pan.id, "white")).toBe(2);
    expect(activeVariants.get(product.id)).toBe("white");
  });
});

describe("money", () => {
  it("converts dollars to integer cents without floating-point drift", () => {
    expect(dollarsToCents(27.98)).toBe(2798);
    expect(dollarsToCents(23.99)).toBe(2399);
    expect(dollarsToCents(9.99)).toBe(999);
  });
});
