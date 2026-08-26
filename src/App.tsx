import AccordionStep from "./components/AccordionStep";
import ReviewPanel from "./components/ReviewPanel";
import { useBundleState } from "./hooks/useBundleState";
import type { Product, Step } from "./types/bundle";
import styles from "./App.module.css";

export default function App() {
  const {
    steps,
    catalog,
    selections,
    activeVariants,
    openStepId,
    saveStatus,
    incrementQuantity,
    setActiveVariant,
    toggleStep,
    goToStep,
    persistBundle,
  } = useBundleState();

  const handleSelectVariant = (productId: string, variantId: string) => {
    setActiveVariant(productId, variantId);
  };

  const handleIncrement = (product: Product, variantId?: string) => {
    incrementQuantity(product.id, variantId ?? "base", 1, { min: product.minQuantity ?? 0 });
  };

  const handleDecrement = (product: Product, variantId?: string) => {
    incrementQuantity(product.id, variantId ?? "base", -1, { min: product.minQuantity ?? 0 });
  };

  const handleToggleSingle = (product: Product, variantId: string | undefined, step: Step) => {
    for (const sibling of step.products) {
      if (sibling.id !== product.id) {
        incrementQuantity(sibling.id, "base", Number.NEGATIVE_INFINITY, { min: 0 });
      }
    }
    incrementQuantity(product.id, variantId ?? "base", 1, { min: 0 });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Let&rsquo;s get started!</h1>

      <div className={styles.container}>
        <main className={styles.builder}>
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
                if (next) goToStep(next.id);
              }}
              onSelectVariant={handleSelectVariant}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onToggleSingle={(product, variantId) => handleToggleSingle(product, variantId, step)}
            />
          ))}
        </main>

        <ReviewPanel
          catalog={catalog}
          selections={selections}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onSave={persistBundle}
          saveStatus={saveStatus}
        />
      </div>
    </div>
  );
}
