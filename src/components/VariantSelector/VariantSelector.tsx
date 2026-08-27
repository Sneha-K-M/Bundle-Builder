import type { ProductVariant } from "../../types/bundle";
import { variantArtUrl } from "../../utils/assets";
import { cx } from "../../utils/cx";

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
    <div className="flex flex-wrap gap-[3px]" role="radiogroup" aria-label="Color">
      {variants.map((variant) => {
        const active = variant.id === activeVariantId;
        const artUrl = variantArtUrl(imageKey, variant.id);
        const label = variant.label ?? variant.id;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            className={cx(
              "inline-flex h-[26px] flex-[0_1_65px] items-center justify-center gap-[3px] rounded-[2px] border-[0.5px] px-[3px] py-px text-[10px] font-normal tracking-[0.6px] leading-none transition-colors",
              active
                ? "border-variant bg-variant-bg text-ink"
                : "border-line-strong bg-white text-muted"
            )}
            onClick={() => onSelect(variant.id)}
          >
            {artUrl ? (
              <img src={artUrl} alt="" className="h-full w-auto shrink-0 rounded-[5px] object-contain aspect-square" />
            ) : (
              <span
                className="h-4 w-4 shrink-0 rounded-full border border-black/12"
                style={{ background: variant.swatch }}
              />
            )}
            <span className="shrink-0 whitespace-nowrap">{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
