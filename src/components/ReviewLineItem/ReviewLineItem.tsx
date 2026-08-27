import { PlaceholderProductIcon } from "../../icons/Icons";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import type { LineItem, QuantityChangeHandler } from "../../types/bundle";
import { productArtUrl, variantArtUrl } from "../../utils/assets";
import { cx } from "../../utils/cx";
import AppImage from "../ui/AppImage/AppImage";
import Price from "../ui/Price/Price";

interface ReviewLineItemProps {
  item: LineItem;
  onQuantityChange: QuantityChangeHandler;
}

export default function ReviewLineItem({ item, onQuantityChange }: ReviewLineItemProps) {
  const { product, variant, quantity, lineTotalCents, lineOriginalCents, selectionType } = item;
  const min = product.minQuantity ?? 0;
  const locked = Boolean(product.locked);
  const isSingleSelect = selectionType === "single";
  const artUrl = variantArtUrl(product.image, variant.id) ?? productArtUrl(product.image);
  const displayName =
    variant.label != null && variant.label.length > 0
      ? `${product.name} — ${variant.label}`
      : product.name;

  return (
    <div
      className={cx(
        "grid items-center gap-x-2.5 py-2.5",
        isSingleSelect
          ? "grid-cols-[36px_minmax(0,1fr)_auto]"
          : "grid-cols-[36px_minmax(0,1fr)_auto_auto] max-xs:grid-cols-[36px_minmax(0,1fr)_auto] max-xs:[grid-template-areas:'thumb_name_price'_'thumb_stepper_price']"
      )}
    >
      <div className={cx("h-9 w-9", !isSingleSelect && "max-xs:[grid-area:thumb]")}>
        <AppImage
          src={artUrl}
          alt=""
          decorative
          className="h-full w-full"
          fallback={<PlaceholderProductIcon label={product.name} className="h-full w-full" />}
        />
      </div>
      <div
        className={cx(
          "text-[13px] font-semibold leading-snug text-ink",
          !isSingleSelect && "max-xs:[grid-area:name]"
        )}
      >
        {displayName}
      </div>
      {!isSingleSelect && (
        <div className="justify-self-end max-xs:justify-self-start max-xs:[grid-area:stepper]">
          <QuantityStepper
            size="sm"
            quantity={quantity}
            min={min}
            label={displayName}
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
