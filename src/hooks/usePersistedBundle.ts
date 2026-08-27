import type { ActiveVariants, SavedBundle, Selections, StepId } from "../types/bundle";

const STORAGE_KEY = "wyze-bundle-builder:v1";

interface BundlePayload {
  selections: Selections;
  activeVariants: ActiveVariants;
  openStepId: StepId | null;
}

interface StoredPayload {
  selections?: [string, number][];
  activeVariants?: [string, string][];
  openStepId?: StepId | null;
  savedAt?: string | null;
}

export function saveBundle({ selections, activeVariants, openStepId }: BundlePayload): boolean {
  try {
    const payload = {
      selections: Array.from(selections.entries()),
      activeVariants: Array.from(activeVariants.entries()),
      openStepId,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error("Failed to save bundle:", err);
    return false;
  }
}

export function loadSavedBundle(): SavedBundle | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPayload;
    return {
      selections: new Map(parsed.selections ?? []),
      activeVariants: new Map(parsed.activeVariants ?? []),
      openStepId: parsed.openStepId ?? null,
      savedAt: parsed.savedAt ?? null,
    };
  } catch (err) {
    console.error("Failed to load saved bundle:", err);
    return null;
  }
}

export function clearSavedBundle(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear saved bundle:", err);
  }
}

export function hasSavedBundle(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
