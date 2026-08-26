import { PlaceholderProductIcon } from "../../icons/Icons";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import type { LineItem, QuantityHandler } from "../../types/bundle";
import { formatCurrency } from "../../utils/pricing";

import styles from "./ReviewLineItem.module.css";

interface ReviewLineItemProps {
  item: LineItem;
  onIncrement: QuantityHandler;
  onDecrement: QuantityHandler;
}

export default function ReviewLineItem({ item, onIncrement, onDecrement }: ReviewLineItemProps) {
  const { product, variant, quantity, lineTotal, lineOriginal, selectionType } = item;
  const showStrike = lineOriginal > lineTotal;
  const min = product.minQuantity ?? 0;
  const isSingleSelect = selectionType === "single";

  const displayName =
    variant && variant.label ? `${product.name} — ${variant.label}` : product.name;

  return (
    <div className={`${styles.row} ${isSingleSelect ? styles.rowNoStepper : ""}`}>
      <div className={styles.thumb}>
        <PlaceholderProductIcon label={product.name} className={styles.thumbIcon} />
      </div>
      <div className={styles.name}>{displayName}</div>
      <div className={styles.stepperSlot}>
        {!isSingleSelect && (
          <QuantityStepper
            size="sm"
            quantity={quantity}
            min={min}
            label={displayName}
            disabled={Boolean(product.locked && quantity <= min)}
            onDecrement={() => onDecrement(product, variant?.id)}
            onIncrement={() => onIncrement(product, variant?.id)}
          />
        )}
      </div>
      <div className={styles.pricing}>
        {showStrike && <span className={styles.strike}>{formatCurrency(lineOriginal)}</span>}
        <span className={styles.price}>
          {lineTotal === 0 ? "FREE" : formatCurrency(lineTotal)}
          {product.billingSuffix ?? ""}
        </span>
      </div>
    </div>
  );
}
