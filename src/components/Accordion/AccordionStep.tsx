import { CameraIcon, ChevronIcon, GridIcon, SensorIcon, ShieldIcon } from "../../icons/Icons";
import type {
  ActiveVariants,
  QuantityHandler,
  Selections,
  Step,
  StepIconName,
  VariantSelectHandler,
} from "../../types/bundle";
import { countSelectedInStep } from "../../utils/pricing";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./AccordionStep.module.css";
const STEP_ICONS: Record<StepIconName, typeof GridIcon> = {
  camera: CameraIcon,
  shield: ShieldIcon,
  sensor: SensorIcon,
  grid: GridIcon,
};

interface AccordionStepProps {
  step: Step;
  isOpen: boolean;
  selections: Selections;
  activeVariants: ActiveVariants;
  onToggle: () => void;
  onNext: () => void;
  onSelectVariant: VariantSelectHandler;
  onIncrement: QuantityHandler;
  onDecrement: QuantityHandler;
  onToggleSingle: QuantityHandler;
}

export default function AccordionStep({
  step,
  isOpen,
  selections,
  activeVariants,
  onToggle,
  onNext,
  onSelectVariant,
  onIncrement,
  onDecrement,
  onToggleSingle,
}: AccordionStepProps) {
  const StepIcon = STEP_ICONS[step.icon] ?? GridIcon;
  const selectedCount = countSelectedInStep(step, selections);

  return (
    <section className={isOpen ? styles.stepOpen : undefined}>
      <button
        type="button"
        className={styles.header}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className={styles.headerTop}>
          <span className={styles.stepLabel}>STEP {step.stepNumber} OF 4</span>
        </div>
        <div className={styles.headerMain}>
          <span className={styles.titleRow}>
            <StepIcon className={styles.titleIcon} />
            <span className={styles.title}>{step.title}</span>
          </span>
          <span className={`${styles.state} ${isOpen ? styles.stateOpen : ""}`}>
            {selectedCount > 0 && <span className={styles.count}>{selectedCount} selected</span>}
            <ChevronIcon direction={isOpen ? "up" : "down"} className={styles.chevron} />
          </span>
        </div>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.grid}>
            {step.products.map((product, index) => {
              const isLoneLastCard =
                step.products.length % 2 === 1 && index === step.products.length - 1;
              return (
                <div
                  key={product.id}
                  className={`${styles.cardCell} ${isLoneLastCard ? styles.loneCard : ""}`}
                >
                  <ProductCard
                    product={product}
                    selections={selections}
                    activeVariantId={activeVariants.get(product.id)}
                    selectionType={step.selectionType ?? "multi"}
                    onSelectVariant={onSelectVariant}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                    onToggleSingle={onToggleSingle}
                  />
                </div>
              );
            })}
          </div>

          {step.nextLabel && (
            <button type="button" className={styles.nextBtn} onClick={onNext}>
              {step.nextLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
