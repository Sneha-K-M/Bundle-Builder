import type { ActiveVariants, Catalog, SavedBundle, Selections } from "../types/bundle";
import { clampQuantity } from "./money";

export const STORAGE_KEY = "wyze-bundle-builder:v1";

interface BundlePayload {
  selections: Selections;
  activeVariants: ActiveVariants;
}

interface StoredPayload {
  selections?: unknown;
  activeVariants?: unknown;
  savedAt?: unknown;
}

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function parseQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return clampQuantity(value, 0);
}

function parsePairList(raw: unknown): Array<[unknown, unknown]> | null {
  if (!Array.isArray(raw)) return null;
  const pairs: Array<[unknown, unknown]> = [];
  for (const item of raw) {
    if (!Array.isArray(item) || item.length !== 2) return null;
    pairs.push([item[0], item[1]]);
  }
  return pairs;
}

export function saveBundle({ selections, activeVariants }: BundlePayload): boolean {
  if (!canUseStorage()) return false;
  try {
    const payload = {
      selections: Array.from(selections.entries()),
      activeVariants: Array.from(activeVariants.entries()),
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadSavedBundle(catalog: Catalog): SavedBundle | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPayload;

    const selectionPairs = parsePairList(parsed.selections);
    const variantPairs = parsePairList(parsed.activeVariants);
    if (!selectionPairs || !variantPairs) return null;

    const selections: Selections = new Map();
    for (const [key, value] of selectionPairs) {
      if (typeof key !== "string" || !catalog.has(key)) continue;
      const quantity = parseQuantity(value);
      if (quantity === null) continue;
      selections.set(key, quantity);
    }

    if (selectionPairs.length > 0 && selections.size === 0) return null;

    const knownProductIds = new Set(Array.from(catalog.values()).map((entry) => entry.product.id));
    const activeVariants: ActiveVariants = new Map();
    for (const [key, value] of variantPairs) {
      if (typeof key !== "string" || !knownProductIds.has(key)) continue;
      if (typeof value !== "string") continue;
      activeVariants.set(key, value);
    }

    return {
      selections,
      activeVariants,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : null,
    };
  } catch {
    return null;
  }
}

export function clearSavedBundle(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage may be unavailable */
  }
}
