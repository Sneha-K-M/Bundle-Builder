import IconButton from "../ui/IconButton/IconButton";
import { cx } from "../../utils/cx";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  size?: "md" | "sm";
  label?: string;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  size = "md",
  label,
  decrementDisabled = false,
  incrementDisabled = false,
}: QuantityStepperProps) {
  const atMin = quantity <= min;
  const groupLabel = label ? `Quantity of ${label}` : "Quantity";
  const compact = size === "sm";

  return (
    <div className="inline-flex items-center gap-[3px]" role="group" aria-label={groupLabel}>
      <IconButton
        variant="stepper"
        size={compact ? "sm" : "md"}
        label={`Decrease ${groupLabel.toLowerCase()}`}
        onClick={onDecrement}
        disabled={decrementDisabled || atMin}
      >
        &minus;
      </IconButton>
      <span
        className={cx(
          "inline-flex items-center justify-center bg-transparent font-semibold text-ink",
          compact ? "min-w-5 px-0.5 text-[13px]" : "min-w-6 px-1 text-sm"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <IconButton
        variant="stepper"
        size={compact ? "sm" : "md"}
        label={`Increase ${groupLabel.toLowerCase()}`}
        onClick={onIncrement}
        disabled={incrementDisabled}
      >
        +
      </IconButton>
    </div>
  );
}
