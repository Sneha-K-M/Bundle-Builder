import { PlaceholderProductIcon } from "../../icons/Icons";
import type { Product, QuantityHandler, SelectionType, Selections, VariantSelectHandler } from "../../types/bundle";
import { formatCurrency, lineKey } from "../../utils/pricing";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import styles from "./ProductCard.module.css";
import VariantSelector from "../VariantSelector/VariantSelector";


interface ProductCardProps {
  product: Product;
  selections: Selections;
  activeVariantId?: string;
  onSelectVariant: VariantSelectHandler;
  onIncrement: QuantityHandler;
  onDecrement: QuantityHandler;
  onToggleSingle: QuantityHandler;
  selectionType?: SelectionType;
}

export default function ProductCard({
  product,
  selections,
  activeVariantId,
  onSelectVariant,
  onIncrement,
  onDecrement,
  onToggleSingle,
  selectionType = "multi",
}: ProductCardProps) {
  const hasVariants = product.variants.length > 0;
  const effectiveVariantId = hasVariants ? activeVariantId ?? product.defaultVariant ?? "base" : "base";
  const quantity = selections.get(lineKey(product.id, effectiveVariantId)) ?? 0;
  const isSelected = quantity > 0;
  const min = product.minQuantity ?? 0;

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.media}>
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <div className={styles.mediaFrame}>
          <PlaceholderProductIcon label={product.name} className={styles.mediaIcon} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.description}>
            {product.description}{" "}
            {product.learnMoreUrl && (
              <a href={product.learnMoreUrl} className={styles.learnMore}>
                Learn More
              </a>
            )}
          </p>

          {hasVariants && (
            <VariantSelector
              variants={product.variants}
              activeVariantId={effectiveVariantId}
              onSelect={(variantId) => onSelectVariant(product.id, variantId)}
            />
          )}
        </div>

        <div className={styles.footer}>
          {selectionType === "single" ? (
            <button
              type="button"
              className={`${styles.selectBtn} ${isSelected ? styles.selectBtnActive : ""}`}
              onClick={() => onToggleSingle(product, effectiveVariantId)}
            >
              {isSelected ? "✓ Selected" : "Select plan"}
            </button>
          ) : (
            <QuantityStepper
              quantity={quantity}
              min={min}
              label={product.name}
              disabled={Boolean(product.locked && quantity <= min)}
              onDecrement={() => onDecrement(product, effectiveVariantId)}
              onIncrement={() => onIncrement(product, effectiveVariantId)}
            />
          )}

          <div className={styles.pricing}>
            {product.originalPrice != null && product.originalPrice > product.price && (
              <span className={styles.priceStrike}>{formatCurrency(product.originalPrice)}</span>
            )}
            <span className={styles.price}>
              {product.price === 0 ? "FREE" : formatCurrency(product.price)}
              {product.billingSuffix ?? ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
