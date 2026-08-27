import { useState } from "react";
import AccordionStep from "./components/Accordion/AccordionStep";
import ReviewPanel from "./components/ReviewPanel/ReviewPanel";
import { useBundleState } from "./hooks/useBundleState";
import type { Product } from "./types/bundle";

export default function App() {
  const {
    steps,
    reviewCategoryOrder,
    selections,
    activeVariants,
    openStepId,
    saveStatus,
    totals,
    canCheckout,
    incrementQuantity,
    setActiveVariant,
    selectExclusive,
    toggleStep,
    goToStep,
    persistBundle,
  } = useBundleState();

  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  const handleQuantityChange = (product: Product, variantId: string, delta: number) => {
    incrementQuantity(product.id, variantId, delta);
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-8 pb-16 max-md:px-0 max-md:pt-5 max-md:pb-12 max-xs:pt-3 max-xs:pb-10">
      <h1 className="mx-0 mt-1 mb-4 text-center text-[26px] font-extrabold tracking-tight text-ink md:sr-only">
        Let&rsquo;s get started!
      </h1>

      <div className="mx-auto max-w-[1213px] md:max-xl:grid md:max-xl:max-w-[1156px] md:max-xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] md:max-xl:items-start md:max-xl:gap-6">
        <main className="flex min-w-0 flex-col gap-[13px]">
          {steps.map((step, index) => (
            <AccordionStep
              key={step.id}
              step={step}
              isOpen={openStepId === step.id}
              selections={selections}
              activeVariants={activeVariants}
              onToggle={() => toggleStep(step.id)}
              onNext={() => {
                const next = steps[index + 1];
                if (!next) return;
                goToStep(next.id);
                requestAnimationFrame(() => {
                  document.getElementById(`step-header-${next.id}`)?.focus();
                });
              }}
              onSelectVariant={setActiveVariant}
              onQuantityChange={handleQuantityChange}
              onSelectExclusive={selectExclusive}
            />
          ))}
        </main>

        <ReviewPanel
          totals={totals}
          categoryOrder={reviewCategoryOrder}
          onQuantityChange={handleQuantityChange}
          onSave={persistBundle}
          onCheckout={() => {
            if (!canCheckout) return;
            setCheckoutNotice("Demo only — checkout is not connected to a payment provider.");
          }}
          saveStatus={saveStatus}
          canCheckout={canCheckout}
          checkoutNotice={checkoutNotice}
        />
      </div>
    </div>
  );
}
