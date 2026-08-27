import { PlaceholderProductIcon } from "../../icons/Icons";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import type { LineItem, QuantityChangeHandler } from "../../types/bundle";
import { productArtUrl, variantArtUrl } from "../../utils/assets";
import { cx } from "../../utils/cx";
import AppImage from "../ui/AppImage/AppImage";
import Price from "../ui/Price/Price";

interface ReviewLineItemProps {
  item: LineItem;
  showVariant: boolean;
  onQuantityChange: QuantityChangeHandler;
}

export function reviewDisplayName(item: LineItem, showVariant: boolean): string {
  if (showVariant && item.variant.label) {
    return `${item.product.name} — ${item.variant.label}`;
  }
  return item.product.name;
}

function AccentName({ name, accent }: { name: string; accent?: string }) {
  if (!accent || !name.includes(accent)) return name;
  const index = name.indexOf(accent);
  return (
    <>
      {name.slice(0, index)}
      <span className="text-accent">{accent}</span>
      {name.slice(index + accent.length)}
    </>
  );
}

export default function ReviewLineItem({
  item,
  showVariant,
  onQuantityChange,
}: ReviewLineItemProps) {
  const { product, variant, quantity, lineTotalCents, lineOriginalCents, selectionType } = item;
  const min = product.minQuantity ?? 0;
  const locked = Boolean(product.locked);
  const isSingleSelect = selectionType === "single";
  const artUrl = variantArtUrl(product.image, variant.id) ?? productArtUrl(product.image);
  const displayName = reviewDisplayName(item, showVariant);

  return (
    <div
      className={cx(
        "grid items-center gap-x-2.5 py-2",
        isSingleSelect
          ? "-mx-8 grid-cols-[28px_minmax(0,1fr)_auto] px-8 py-3 max-xl:-mx-6 max-xl:px-6 max-md:-mx-[15px] max-md:px-[15px]"
          : "grid-cols-[40px_minmax(0,1fr)_auto_auto] max-xs:grid-cols-[40px_minmax(0,1fr)_auto] max-xs:[grid-template-areas:'thumb_name_price'_'thumb_stepper_price']"
      )}
    >
      <div
        className={cx(
          "flex shrink-0 items-center justify-center overflow-hidden",
          isSingleSelect ? "h-[31px] w-[26px]" : "h-10 w-10 rounded-[5px] border border-line bg-white",
          !isSingleSelect && "max-xs:[grid-area:thumb]"
        )}
      >
        <AppImage
          src={artUrl}
          alt=""
          decorative
          className="h-full w-full object-contain"
          fallback={<PlaceholderProductIcon label={product.name} className="h-8 w-8" />}
        />
      </div>
      <div
        className={cx(
          "text-[13px] font-semibold leading-snug text-ink",
          !isSingleSelect && "max-xs:[grid-area:name]"
        )}
      >
        <AccentName name={displayName} accent={product.nameAccent} />
      </div>
      {!isSingleSelect && (
        <div className="justify-self-end max-xs:justify-self-start max-xs:[grid-area:stepper]">
          <QuantityStepper
            size="sm"
            quantity={quantity}
            min={min}
            label={`${displayName} in review`}
            decrementDisabled={locked}
            incrementDisabled={locked}
            onDecrement={() => onQuantityChange(product, variant.id, -1)}
            onIncrement={() => onQuantityChange(product, variant.id, 1)}
          />
        </div>
      )}
      <div className={cx(!isSingleSelect && "max-xs:[grid-area:price]")}>
        <Price
          amountCents={lineTotalCents}
          compareAtCents={lineOriginalCents}
          suffix={product.billingSuffix ?? ""}
          tone="review"
          layout="stack"
        />
      </div>
    </div>
  );
}
