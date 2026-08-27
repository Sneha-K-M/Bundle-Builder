import styles from "./QuantityStepper.module.css";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  size?: "md" | "sm";
  label?: string;
  disabled?: boolean;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  size = "md",
  label,
  disabled = false,
}: QuantityStepperProps) {
  const atMin = quantity <= min;

  return (
    <div className={`${styles.stepper} ${size === "sm" ? styles.sm : ""}`}>
      <button
        type="button"
        className={styles.btn}
        onClick={onDecrement}
        disabled={disabled || atMin}
        aria-label={`Decrease quantity${label ? ` of ${label}` : ""}`}
      >
        &minus;
      </button>
      <span className={styles.value} aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={onIncrement}
        disabled={disabled}
        aria-label={`Increase quantity${label ? ` of ${label}` : ""}`}
      >
        +
      </button>
    </div>
  );
}
