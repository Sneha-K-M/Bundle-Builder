import type { ProductVariant } from "../../types/bundle";
import { variantArtUrl } from "../../utils/assets";
import styles from "./VariantSelector.module.css";

interface VariantSelectorProps {
  imageKey: string;
  variants: ProductVariant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

export default function VariantSelector({
  imageKey,
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className={styles.row} role="radiogroup" aria-label="Color">
      {variants.map((variant) => {
        const active = variant.id === activeVariantId;
        const artUrl = variantArtUrl(imageKey, variant.id);
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.chip} ${active ? styles.active : ""}`}
            onClick={() => onSelect(variant.id)}
          >
            {artUrl ? (
              <img src={artUrl} alt="" className={styles.chipImage} />
            ) : (
              <span className={styles.swatch} style={{ background: variant.swatch }} />
            )}
            <span className={styles.label}>{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
