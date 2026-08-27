import { CameraIcon, ChevronIcon, GridIcon, SensorIcon, ShieldIcon } from "../../icons/Icons";
import type {
  ActiveVariants,
  ExclusiveSelectHandler,
  QuantityChangeHandler,
  Selections,
  Step,
  StepIconName,
  VariantSelectHandler,
} from "../../types/bundle";
import { iconUrl } from "../../utils/assets";
import { cx } from "../../utils/cx";
import { countSelectedInStep } from "../../utils/pricing";
import Button from "../ui/Button/Button";
import Typography from "../ui/Typography/Typography";
import ProductCard from "../ProductCard/ProductCard";

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
  onQuantityChange: QuantityChangeHandler;
  onSelectExclusive: ExclusiveSelectHandler;
}

export default function AccordionStep({
  step,
  isOpen,
  selections,
  activeVariants,
  onToggle,
  onNext,
  onSelectVariant,
  onQuantityChange,
  onSelectExclusive,
}: AccordionStepProps) {
  const StepIcon = STEP_ICONS[step.icon] ?? GridIcon;
  const stepIconUrl = iconUrl(step.icon);
  const selectedCount = countSelectedInStep(step, selections);
  const headerId = `step-header-${step.id}`;
  const panelId = `step-panel-${step.id}`;

  return (
    <section className={cx(isOpen && "rounded-lg bg-panel")}>
      <h2 className="m-0">
        <Button
          variant="disclosure"
          id={headerId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="px-[15px] pt-3">
            <Typography variant="eyebrow" as="span">
              STEP {step.stepNumber} OF 4
            </Typography>
          </span>
          <span
            className={cx(
              "flex min-h-[71px] items-center justify-between gap-3 border-y-[0.5px] border-rule px-[15px] py-5",
              "md:max-xl:min-h-[67px] max-md:min-h-[65px]",
              isOpen && "border-b-transparent"
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              {stepIconUrl ? (
                <img src={stepIconUrl} alt="" className="h-[22px] w-[22px] shrink-0" />
              ) : (
                <StepIcon className="h-[22px] w-[22px] shrink-0 text-ink" />
              )}
              <span className="text-xl font-bold text-ink max-md:text-[17px]">{step.title}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              {selectedCount > 0 && (
                <span className="text-[13.5px] font-semibold text-accent">
                  {selectedCount} selected
                </span>
              )}
              <ChevronIcon
                direction={isOpen ? "up" : "down"}
                className="h-[7px] w-2.5 shrink-0 text-chevron"
              />
            </span>
          </span>
        </Button>
      </h2>

      <div id={panelId} role="region" aria-labelledby={headerId} hidden={!isOpen}>
        <div className="px-[15px] pb-6 max-md:pb-5">
          <div className="grid grid-cols-1 auto-rows-auto gap-[19px] sm:grid-cols-2 sm:auto-rows-fr md:grid-cols-1 md:auto-rows-auto lg:grid-cols-2 lg:auto-rows-fr xl:grid-cols-5">
            {step.products.map((product, index) => {
              const isLoneLastCard =
                step.products.length % 2 === 1 && index === step.products.length - 1;
              return (
                <div
                  key={product.id}
                  className={cx(
                    "@container flex min-w-0",
                    isLoneLastCard &&
                      "sm:max-md:col-span-full sm:max-md:justify-center sm:max-md:[&>*]:max-w-[calc(50%-9.5px)] lg:max-xl:col-span-full lg:max-xl:justify-center lg:max-xl:[&>*]:max-w-[calc(50%-9.5px)]"
                  )}
                >
                  <ProductCard
                    product={product}
                    step={step}
                    selections={selections}
                    activeVariants={activeVariants}
                    selectionType={step.selectionType ?? "multi"}
                    onSelectVariant={onSelectVariant}
                    onQuantityChange={onQuantityChange}
                    onSelectExclusive={onSelectExclusive}
                  />
                </div>
              );
            })}
          </div>

          {step.nextLabel && (
            <div className="mt-5 flex justify-center">
              <Button variant="outline" onClick={onNext}>
                {step.nextLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
