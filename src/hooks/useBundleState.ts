import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { productsData } from "../data/catalog";
import type { ExclusiveSelectHandler, SaveStatus, Selections, StepId } from "../types/bundle";
import { loadSavedBundle, saveBundle } from "../utils/persistence";
import { buildCatalog, computeTotals, hasAnySelection } from "../utils/pricing";
import {
  adjustLineQuantity,
  buildSeedState,
  selectExclusiveProduct,
  setActiveVariantMap,
} from "../utils/selections";

const SAVE_FEEDBACK_MS = 2400;

function getInitialState(catalog: ReturnType<typeof buildCatalog>["catalog"]) {
  const seed = buildSeedState(productsData.steps);
  const saved = loadSavedBundle(catalog);
  if (!saved) {
    return {
      selections: seed.selections,
      activeVariants: seed.activeVariants,
      saveStatus: "idle" as SaveStatus,
    };
  }
  return {
    selections: saved.selections,
    activeVariants: saved.activeVariants.size ? saved.activeVariants : seed.activeVariants,
    saveStatus: "restored" as SaveStatus,
  };
}

export function useBundleState() {
  const { catalog, productById } = useMemo(() => buildCatalog(productsData), []);
  const initial = useMemo(() => getInitialState(catalog), [catalog]);

  const [selections, setSelections] = useState<Selections>(initial.selections);
  const [activeVariants, setActiveVariants] = useState(initial.activeVariants);
  const [openStepId, setOpenStepId] = useState<StepId | null>(
    productsData.steps[0]?.id ?? "cameras"
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(initial.saveStatus);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (initial.saveStatus !== "restored") return;
    const id = window.setTimeout(() => setSaveStatus("idle"), SAVE_FEEDBACK_MS);
    return () => window.clearTimeout(id);
  }, [initial.saveStatus]);

  useEffect(() => {
    return () => {
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    };
  }, []);

  const incrementQuantity = useCallback(
    (productId: string, variantId: string, delta: number) => {
      setSelections((prev) =>
        adjustLineQuantity(prev, productById.get(productId), productId, variantId, delta)
      );
    },
    [productById]
  );

  const setActiveVariant = useCallback((productId: string, variantId: string) => {
    setActiveVariants((prev) => setActiveVariantMap(prev, productId, variantId));
  }, []);

  const selectExclusive = useCallback<ExclusiveSelectHandler>(
    (product, step, variantId) => {
      const fullProduct = productById.get(product.id);
      if (!fullProduct) return;
      setSelections((prev) => selectExclusiveProduct(prev, step, fullProduct, variantId));
    },
    [productById]
  );

  const toggleStep = useCallback((stepId: StepId) => {
    setOpenStepId((prev) => (prev === stepId ? null : stepId));
  }, []);

  const goToStep = useCallback((stepId: StepId) => {
    setOpenStepId(stepId);
  }, []);

  const persistBundle = useCallback(() => {
    const ok = saveBundle({ selections, activeVariants });
    setSaveStatus(ok ? "saved" : "error");
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    if (ok) {
      saveTimer.current = window.setTimeout(() => setSaveStatus("idle"), SAVE_FEEDBACK_MS);
    }
  }, [selections, activeVariants]);

  const totals = useMemo(
    () => computeTotals(selections, catalog, productsData.reviewCategoryOrder),
    [selections, catalog]
  );

  return {
    steps: productsData.steps,
    reviewCategoryOrder: productsData.reviewCategoryOrder,
    selections,
    activeVariants,
    openStepId,
    saveStatus,
    totals,
    canCheckout: hasAnySelection(selections),
    incrementQuantity,
    setActiveVariant,
    selectExclusive,
    toggleStep,
    goToStep,
    persistBundle,
  };
}
