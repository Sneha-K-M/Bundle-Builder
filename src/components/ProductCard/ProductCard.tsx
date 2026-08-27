import { PlaceholderProductIcon } from "../../icons/Icons";
import type {
  ActiveVariants,
  ExclusiveSelectHandler,
  Product,
  QuantityChangeHandler,
  SelectionType,
  Selections,
  Step,
  VariantSelectHandler,
} from "../../types/bundle";
import { productArtUrl, variantArtUrl } from "../../utils/assets";
import { cx } from "../../utils/cx";
import { lineKey } from "../../utils/line";
import { dollarsToCents } from "../../utils/money";
import { activeVariantFor, productHasSelection } from "../../utils/selections";
import Badge from "../ui/Badge/Badge";
import AppImage from "../ui/AppImage/AppImage";
import Button from "../ui/Button/Button";
import Price from "../ui/Price/Price";
import Typography from "../ui/Typography/Typography";
import QuantityStepper from "../QuantityStepper/QuantityStepper";
import VariantSelector from "../VariantSelector/VariantSelector";

interface ProductCardProps {
  product: Product;
  step: Step;
  selections: Selections;
  activeVariants: ActiveVariants;
  onSelectVariant: VariantSelectHandler;
  onQuantityChange: QuantityChangeHandler;
  onSelectExclusive: ExclusiveSelectHandler;
  selectionType?: SelectionType;
}

export default function ProductCard({
  product,
  step,
  selections,
  activeVariants,
  onSelectVariant,
  onQuantityChange,
  onSelectExclusive,
  selectionType = "multi",
}: ProductCardProps) {
  const hasVariants = product.variants.length > 0;
  const effectiveVariantId = activeVariantFor(product, activeVariants);
  const quantity = selections.get(lineKey(product.id, effectiveVariantId)) ?? 0;
  const isSelected = productHasSelection(product, selections);
  const min = product.minQuantity ?? 0;
  const locked = Boolean(product.locked);
  const artUrl =
    variantArtUrl(product.image, effectiveVariantId) ?? productArtUrl(product.image);

  return (
    <article
      className={cx(
        "flex h-full w-full flex-col gap-2.5 rounded-[10px] border-2 bg-card p-[11px] shadow-card transition-colors",
        isSelected ? "border-selected" : "border-line hover:border-card-hover",
        "md:max-xl:min-h-[159px] md:max-xl:flex-row md:max-xl:gap-[19px]",
        "xl:min-h-0 xl:flex-col xl:gap-2.5",
        "@max-[220px]:min-h-0 @max-[220px]:flex-col @max-[220px]:gap-2.5"
      )}
    >
      <div
        className={cx(
          "relative w-full shrink-0",
          "md:max-xl:w-[101px]",
          "xl:w-full",
          "@max-[220px]:w-full"
        )}
      >
        {product.badge && <Badge>{product.badge}</Badge>}
        <div
          className={cx(
            "flex aspect-[202.6/117.394] w-full items-center justify-center overflow-hidden rounded-[5px]",
            "md:max-xl:h-[137px] md:max-xl:w-[101px] md:max-xl:aspect-auto",
            "xl:h-auto xl:w-full xl:aspect-[202.6/117.394]",
            "max-md:h-[137px] max-md:aspect-auto",
            "@max-[220px]:h-auto @max-[220px]:w-full @max-[220px]:aspect-[202.6/117.394]"
          )}
        >
          <AppImage
            src={artUrl}
            alt={product.name}
            className="h-full w-full rounded-[5px]"
            fallback={<PlaceholderProductIcon label={product.name} className="h-full w-full rounded-[5px]" />}
          />
        </div>
      </div>

      <div
        className={cx(
          "flex min-w-0 flex-1 flex-col justify-between gap-2",
          "md:max-xl:justify-start md:max-xl:gap-0",
          "xl:justify-between xl:gap-2",
          "@max-[220px]:justify-between @max-[220px]:gap-2"
        )}
      >
        <div
          className={cx(
            "flex min-w-0 flex-col gap-2",
            "md:max-xl:flex-1 md:max-xl:justify-center",
            "xl:flex-none xl:justify-start",
            "@max-[220px]:flex-none @max-[220px]:justify-start"
          )}
        >
          <Typography variant="title" as="h3">
            {product.name}
          </Typography>
          <Typography variant="body">
            {product.description}{" "}
            {product.learnMoreUrl && (
              <a
                href={product.learnMoreUrl}
                className="font-medium whitespace-nowrap text-accent underline"
                target="_blank"
                rel="noreferrer"
              >
                Learn More
              </a>
            )}
          </Typography>

          {hasVariants && (
            <VariantSelector
              imageKey={product.image}
              variants={product.variants}
              activeVariantId={effectiveVariantId}
              onSelect={(variantId) => onSelectVariant(product.id, variantId)}
            />
          )}
        </div>

        <div
          className={cx(
            selectionType === "single"
              ? "flex flex-col items-center gap-1.5 pt-2"
              : cx(
                  "flex flex-wrap items-center justify-between gap-2 pt-1",
                  "md:max-xl:flex-nowrap md:max-xl:items-end md:max-xl:gap-3 md:max-xl:pt-2.5",
                  "xl:flex-wrap xl:items-center xl:gap-2 xl:pt-1",
                  "@max-[220px]:flex-wrap @max-[220px]:items-center @max-[220px]:gap-2 @max-[220px]:pt-1"
                )
          )}
        >
          {selectionType === "single" ? (
            <Button
              variant="ghost"
              size="sm"
              active={isSelected}
              onClick={() => onSelectExclusive(product, step, effectiveVariantId)}
            >
              {isSelected ? "✓ Selected" : "Select plan"}
            </Button>
          ) : (
            <QuantityStepper
              quantity={quantity}
              min={min}
              label={product.name}
              decrementDisabled={locked}
              incrementDisabled={locked}
              onDecrement={() => onQuantityChange(product, effectiveVariantId, -1)}
              onIncrement={() => onQuantityChange(product, effectiveVariantId, 1)}
            />
          )}

          <Price
            amountCents={dollarsToCents(product.price)}
            compareAtCents={
              product.originalPrice != null ? dollarsToCents(product.originalPrice) : undefined
            }
            suffix={product.billingSuffix ?? ""}
            tone="card"
            align={selectionType === "single" ? "center" : "end"}
          />
        </div>
      </div>
    </article>
  );
}
