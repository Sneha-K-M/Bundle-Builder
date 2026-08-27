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

  return (
    <div
      className={cx(
        "inline-flex h-8 items-center overflow-hidden rounded-sm border border-line-strong bg-stepper",
        size === "sm" && "h-8"
      )}
      role="group"
      aria-label={groupLabel}
    >
      <IconButton
        label={`Decrease ${groupLabel.toLowerCase()}`}
        className="h-full min-h-8 w-8 min-w-8 border-0 bg-transparent text-base leading-none text-muted hover:bg-stepper-hover hover:text-ink disabled:hover:bg-transparent disabled:hover:text-muted"
        onClick={onDecrement}
        disabled={decrementDisabled || atMin}
      >
        &minus;
      </IconButton>
      <span
        className={cx(
          "min-w-[26px] text-center text-sm font-semibold text-ink",
          size === "sm" && "min-w-5 text-[13px]"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <IconButton
        label={`Increase ${groupLabel.toLowerCase()}`}
        className={cx(
          "h-full min-h-8 w-8 min-w-8 border-0 bg-transparent leading-none text-muted hover:bg-stepper-hover hover:text-ink disabled:hover:bg-transparent disabled:hover:text-muted",
          size === "sm" ? "text-sm" : "text-base"
        )}
        onClick={onIncrement}
        disabled={incrementDisabled}
      >
        +
      </IconButton>
    </div>
  );
}
