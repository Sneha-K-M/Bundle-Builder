import { useCallback, useMemo, useState } from "react";
import { productsData } from "../data/catalog";
import type {
  ActiveVariants,
  QuantityOptions,
  SaveStatus,
  Selections,
  StepId,
} from "../types/bundle";
import { buildCatalog, lineKey } from "../utils/pricing";
import { clearSavedBundle, loadSavedBundle, saveBundle } from "./usePersistedBundle";

function buildSeedState(): { selections: Selections; activeVariants: ActiveVariants } {
  const selections: Selections = new Map();
  const activeVariants: ActiveVariants = new Map();

  for (const step of productsData.steps) {
    for (const product of step.products) {
      const seed = product.seedQuantities ?? {};
      for (const [variantId, qty] of Object.entries(seed)) {
        selections.set(lineKey(product.id, variantId), qty);
      }
      const firstSeededVariant = Object.keys(seed)[0];
      activeVariants.set(product.id, firstSeededVariant ?? product.defaultVariant ?? "base");
    }
  }

  return { selections, activeVariants };
}

export function useBundleState() {
  const { catalog, stepByProductId } = useMemo(() => buildCatalog(productsData), []);

  const [selections, setSelections] = useState<Selections>(() => {
    const saved = loadSavedBundle();
    if (saved) return saved.selections;
    return buildSeedState().selections;
  });

  const [activeVariants, setActiveVariants] = useState<ActiveVariants>(() => {
    const saved = loadSavedBundle();
    if (saved && saved.activeVariants.size) return saved.activeVariants;
    return buildSeedState().activeVariants;
  });

  const [openStepId, setOpenStepId] = useState<StepId | null>(() => {
    const saved = loadSavedBundle();
    return saved?.openStepId ?? productsData.steps[0].id;
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>(
    loadSavedBundle() ? "restored" : "idle"
  );

  const setQuantity = useCallback(
    (productId: string, variantId: string, quantity: number, options: QuantityOptions = {}) => {
      const product = [...stepByProductId.values()]
        .flatMap((s) => s.products)
        .find((p) => p.id === productId);
      const min = options.min ?? product?.minQuantity ?? 0;
      const safeQty = Math.max(min, quantity);

      setSelections((prev) => {
        const next = new Map(prev);
        next.set(lineKey(productId, variantId), safeQty);
        return next;
      });
    },
    [stepByProductId]
  );

  const incrementQuantity = useCallback(
    (productId: string, variantId: string, delta: number, options: QuantityOptions = {}) => {
      setSelections((prev) => {
        const key = lineKey(productId, variantId);
        const current = prev.get(key) ?? 0;
        const min = options.min ?? options.product?.minQuantity ?? 0;
        const next = new Map(prev);
        next.set(key, Math.max(min, current + delta));
        return next;
      });
    },
    []
  );

  const setActiveVariant = useCallback((productId: string, variantId: string) => {
    setActiveVariants((prev) => {
      const next = new Map(prev);
      next.set(productId, variantId);
      return next;
    });
  }, []);

  const toggleStep = useCallback((stepId: StepId) => {
    setOpenStepId((prev) => (prev === stepId ? null : stepId));
  }, []);

  const goToStep = useCallback((stepId: StepId) => {
    setOpenStepId(stepId);
  }, []);

  const persistBundle = useCallback(() => {
    const ok = saveBundle({ selections, activeVariants, openStepId });
    setSaveStatus(ok ? "saved" : "error");
    if (ok) {
      window.setTimeout(() => setSaveStatus("idle"), 2400);
    }
  }, [selections, activeVariants, openStepId]);

  const resetBundle = useCallback(() => {
    clearSavedBundle();
    const seed = buildSeedState();
    setSelections(seed.selections);
    setActiveVariants(seed.activeVariants);
    setOpenStepId(productsData.steps[0].id);
    setSaveStatus("idle");
  }, []);

  return {
    steps: productsData.steps,
    catalog,
    selections,
    activeVariants,
    openStepId,
    saveStatus,
    setQuantity,
    incrementQuantity,
    setActiveVariant,
    toggleStep,
    goToStep,
    persistBundle,
    resetBundle,
  };
}
