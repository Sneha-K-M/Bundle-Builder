import rawProducts from "./products.json";
import type {
  Product,
  ProductVariant,
  ProductsData,
  SelectionType,
  Step,
  StepIconName,
  StepId,
} from "../types/bundle";
import { STEP_IDS } from "../types/bundle";

const STEP_ICONS: readonly StepIconName[] = ["camera", "shield", "sensor", "grid"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseVariant(raw: unknown, productId: string): ProductVariant {
  if (!isRecord(raw) || !isString(raw.id)) {
    throw new Error(`Invalid variant on product ${productId}.`);
  }
  if (raw.label !== null && !isString(raw.label)) {
    throw new Error(`Variant ${raw.id} on ${productId} must have a string or null label.`);
  }
  const variant: ProductVariant = {
    id: raw.id,
    label: raw.label,
  };
  if (isString(raw.swatch)) variant.swatch = raw.swatch;
  return variant;
}

function parseSeedQuantities(raw: unknown, productId: string): Record<string, number> {
  if (!isRecord(raw)) {
    throw new Error(`Product ${productId} seedQuantities must be an object.`);
  }
  const seed: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!isNumber(value) || value < 0) {
      throw new Error(`Product ${productId} has an invalid seed quantity for ${key}.`);
    }
    seed[key] = value;
  }
  return seed;
}

function parseProduct(raw: unknown, stepId: StepId): Product {
  if (!isRecord(raw)) {
    throw new Error(`Invalid product in step ${stepId}.`);
  }
  if (!isString(raw.id) || !isString(raw.name) || !isString(raw.description)) {
    throw new Error(`Invalid product identity in step ${stepId}.`);
  }
  if (!isString(raw.learnMoreUrl) || !isString(raw.image)) {
    throw new Error(`Product ${raw.id} is missing learnMoreUrl or image.`);
  }
  if (raw.badge !== null && !isString(raw.badge)) {
    throw new Error(`Product ${raw.id} badge must be a string or null.`);
  }
  if (raw.originalPrice !== null && !isNumber(raw.originalPrice)) {
    throw new Error(`Product ${raw.id} originalPrice must be a number or null.`);
  }
  if (!isNumber(raw.price)) {
    throw new Error(`Product ${raw.id} is missing a numeric price.`);
  }
  if (!Array.isArray(raw.variants)) {
    throw new Error(`Product ${raw.id} variants must be an array.`);
  }
  if (raw.defaultVariant !== null && !isString(raw.defaultVariant)) {
    throw new Error(`Product ${raw.id} defaultVariant must be a string or null.`);
  }

  const id = raw.id;
  const name = raw.name;
  const description = raw.description;
  const learnMoreUrl = raw.learnMoreUrl;
  const image = raw.image;
  const badge = raw.badge;
  const originalPrice = raw.originalPrice;
  const price = raw.price;
  const defaultVariant = raw.defaultVariant;

  const product: Product = {
    id,
    name,
    description,
    learnMoreUrl,
    image,
    badge,
    originalPrice,
    price,
    variants: raw.variants.map((variant) => parseVariant(variant, id)),
    defaultVariant,
    seedQuantities: parseSeedQuantities(raw.seedQuantities, id),
  };

  if (isString(raw.billingSuffix)) product.billingSuffix = raw.billingSuffix;
  if (isString(raw.nameAccent)) product.nameAccent = raw.nameAccent;
  if (raw.locked === true) product.locked = true;
  if (isNumber(raw.minQuantity)) product.minQuantity = raw.minQuantity;

  return product;
}

function parseStep(raw: unknown): Step {
  if (!isRecord(raw) || !isString(raw.id) || !STEP_IDS.includes(raw.id as StepId)) {
    throw new Error(`Unknown or missing step id: ${String(isRecord(raw) ? raw.id : raw)}`);
  }
  const id = raw.id as StepId;
  if (!isNumber(raw.stepNumber) || !isString(raw.title) || !isString(raw.category)) {
    throw new Error(`Step ${id} is missing stepNumber, title, or category.`);
  }
  if (!isString(raw.icon) || !STEP_ICONS.includes(raw.icon as StepIconName)) {
    throw new Error(`Unknown step icon: ${String(raw.icon)}`);
  }
  if (raw.nextLabel !== null && !isString(raw.nextLabel)) {
    throw new Error(`Step ${id} nextLabel must be a string or null.`);
  }
  if (!Array.isArray(raw.products) || raw.products.length === 0) {
    throw new Error(`Step ${id} must include at least one product.`);
  }

  const step: Step = {
    id,
    stepNumber: raw.stepNumber,
    title: raw.title,
    icon: raw.icon as StepIconName,
    category: raw.category,
    nextLabel: raw.nextLabel,
    products: raw.products.map((product) => parseProduct(product, id)),
  };

  if (raw.selectionType === "single" || raw.selectionType === "multi") {
    step.selectionType = raw.selectionType as SelectionType;
  } else if (raw.selectionType != null) {
    throw new Error(`Step ${id} has an invalid selectionType.`);
  }

  return step;
}

function parseProductsData(raw: unknown): ProductsData {
  if (!isRecord(raw) || !Array.isArray(raw.steps) || !Array.isArray(raw.reviewCategoryOrder)) {
    throw new Error("Catalog JSON must include steps and reviewCategoryOrder arrays.");
  }

  const reviewCategoryOrder = raw.reviewCategoryOrder.filter(isString);
  if (reviewCategoryOrder.length === 0) {
    throw new Error("Catalog JSON reviewCategoryOrder cannot be empty.");
  }
  if (raw.steps.length === 0) {
    throw new Error("Catalog JSON must include at least one step.");
  }

  return {
    reviewCategoryOrder,
    steps: raw.steps.map(parseStep),
  };
}

export const productsData = parseProductsData(rawProducts);
