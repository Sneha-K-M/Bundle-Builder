import type { ProductVariant } from "../../types/bundle";
import { variantArtUrl } from "../../utils/assets";
import { cx } from "../../utils/cx";
import Button from "../ui/Button/Button";

interface VariantSelectorProps {
  imageKey: string;
  variants: ProductVariant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

const SWATCH_CLASS: Record<string, string> = {
  "#f5f5f0": "bg-[#f5f5f0]",
  "#8a8a86": "bg-[#8a8a86]",
  "#232323": "bg-[#232323]",
};

export default function VariantSelector({
  imageKey,
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className="flex flex-nowrap items-center gap-[3px]" role="radiogroup" aria-label="Color">
      {variants.map((variant) => {
        const active = variant.id === activeVariantId;
        const artUrl = variantArtUrl(imageKey, variant.id);
        const label = variant.label ?? variant.id;
        const swatchClass = variant.swatch ? SWATCH_CLASS[variant.swatch] : undefined;
        return (
          <Button
            key={variant.id}
            variant="chip"
            active={active}
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => onSelect(variant.id)}
          >
            {artUrl ? (
              <img
                src={artUrl}
                alt=""
                className="h-full w-auto shrink-0 rounded-[5px] object-contain aspect-square"
              />
            ) : (
              <span
                className={cx(
                  "h-4 w-4 shrink-0 rounded-full border border-black/12",
                  swatchClass ?? "bg-muted"
                )}
              />
            )}
            <span className="shrink-0 whitespace-nowrap">{variant.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
