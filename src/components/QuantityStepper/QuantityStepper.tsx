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
  const box = compact
    ? "h-6 w-6 min-h-6 min-w-6 rounded-[4px] text-sm"
    : "h-8 w-8 min-h-8 min-w-8 rounded-[5px] text-base";

  return (
    <div className="inline-flex items-center gap-[3px]" role="group" aria-label={groupLabel}>
      <IconButton
        label={`Decrease ${groupLabel.toLowerCase()}`}
        className={cx(
          "border border-line-strong bg-white leading-none text-muted hover:bg-stepper-hover hover:text-ink disabled:bg-stepper disabled:hover:bg-stepper disabled:hover:text-muted",
          box
        )}
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
        label={`Increase ${groupLabel.toLowerCase()}`}
        className={cx(
          "border border-line-strong bg-white leading-none text-muted hover:bg-stepper-hover hover:text-ink disabled:bg-stepper disabled:hover:bg-stepper disabled:hover:text-muted",
          box
        )}
        onClick={onIncrement}
        disabled={incrementDisabled}
      >
        +
      </IconButton>
    </div>
  );
}
