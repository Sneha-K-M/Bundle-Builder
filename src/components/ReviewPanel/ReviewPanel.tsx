import { BadgeCheckIcon, TruckIcon } from "../../icons/Icons";
import type { BundleTotals, QuantityChangeHandler, SaveStatus } from "../../types/bundle";
import { iconUrl } from "../../utils/assets";
import { formatCents } from "../../utils/money";
import AppImage from "../ui/AppImage/AppImage";
import Button from "../ui/Button/Button";
import Price from "../ui/Price/Price";
import Typography from "../ui/Typography/Typography";
import ReviewLineItem from "../ReviewLineItem/ReviewLineItem";

interface ReviewPanelProps {
  totals: BundleTotals;
  categoryOrder: readonly string[];
  onQuantityChange: QuantityChangeHandler;
  onSave: () => void;
  onCheckout: () => void;
  saveStatus: SaveStatus;
  canCheckout: boolean;
  checkoutNotice: string | null;
}

export default function ReviewPanel({
  totals,
  categoryOrder,
  onQuantityChange,
  onSave,
  onCheckout,
  saveStatus,
  canCheckout,
  checkoutNotice,
}: ReviewPanelProps) {
  const {
    lineItemsByCategory,
    totalCents,
    originalTotalCents,
    savingsCents,
    financingPerMonthCents,
    shippingOriginalCents,
  } = totals;

  const hasAnyItems = Object.values(lineItemsByCategory).some((list) => list.length > 0);
  const saveLabel = saveStatus === "saved" ? "Saved!" : "Save my system for later";
  const shippingIconUrl = iconUrl("truck");
  const guaranteeIconUrl = iconUrl("badge-check");

  return (
    <section
      className="mt-10 rounded-lg bg-panel p-8 max-xl:sticky max-xl:top-5 max-xl:mt-0 max-xl:p-6 max-md:static max-md:mt-8 max-md:rounded-none max-md:px-[15px] max-md:py-6"
      aria-label="Your security system review"
    >
      <Typography variant="eyebrow" className="mb-1.5">
        REVIEW
      </Typography>
      <Typography variant="display" as="h2" className="mb-2">
        Your security system
      </Typography>
      <Typography variant="subheading">
        Review your personalized protection system designed to keep what matters most safe.
      </Typography>

      <div className="my-4 h-px bg-divider" />

      {hasAnyItems ? (
        <div className="flex flex-col">
          {categoryOrder
            .filter((category) => lineItemsByCategory[category]?.length)
            .map((category) => {
              const items = lineItemsByCategory[category];
              return (
                <div key={category} className="mb-1">
                  <Typography variant="label" className="mb-0.5">
                    {category}
                  </Typography>
                  {items.map((item) => (
                    <ReviewLineItem
                      key={item.key}
                      item={item}
                      showVariant={items.some(
                        (other) =>
                          other.product.id === item.product.id &&
                          other.variant.id !== item.variant.id
                      )}
                      onQuantityChange={onQuantityChange}
                    />
                  ))}
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-[13px] leading-normal text-muted">
          Nothing selected yet — choose cameras, sensors, and accessories to build your system.
        </p>
      )}

      <div className="mt-1 mb-3 h-px bg-divider" />

      <div className="flex items-center gap-2.5 py-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-white shadow-[0_0_0_1px_rgba(226,228,245,0.9)]">
          {shippingIconUrl ? (
            <AppImage src={shippingIconUrl} alt="" decorative className="h-full w-full object-contain" />
          ) : (
            <TruckIcon className="h-5 w-5 text-success" />
          )}
        </div>
        <div className="flex-1 text-[13px] font-medium text-ink">Fast Shipping</div>
        <Price amountCents={0} compareAtCents={shippingOriginalCents} tone="review" layout="stack" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="h-[72px] w-[72px] shrink-0">
          {guaranteeIconUrl ? (
            <AppImage
              src={guaranteeIconUrl}
              alt="100% Wyze satisfaction guarantee. Try worry-free for 30 days."
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-accent-soft text-center">
              <BadgeCheckIcon className="h-5 w-5 text-accent" />
              <span className="text-[8.5px] font-bold leading-tight text-accent uppercase">
                100%
                <br />
                satisfaction
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5" aria-live="polite" aria-atomic="true">
          <span className="rounded-pill bg-accent px-2.5 py-1 text-[10.5px] font-bold whitespace-nowrap text-white">
            as low as {formatCents(financingPerMonthCents)}/mo
          </span>
          <Price amountCents={totalCents} compareAtCents={originalTotalCents} tone="total" />
        </div>
      </div>

      {savingsCents > 0 && (
        <p className="mt-3 mb-0 text-center text-[13px] font-semibold text-success">
          Congrats! You&rsquo;re saving {formatCents(savingsCents)} on your security bundle!
        </p>
      )}

      <Button
        variant="primary"
        fullWidth
        className="mt-3.5 rounded-md"
        onClick={onCheckout}
        disabled={!canCheckout}
      >
        Checkout
      </Button>

      <Button variant="link" className="mx-auto mt-3 block w-fit italic font-medium" onClick={onSave}>
        {saveLabel}
      </Button>
      {saveStatus === "restored" && (
        <p className="mt-1 mb-0 text-center text-[11.5px] text-success">
          Restored your saved system.
        </p>
      )}
      {saveStatus === "error" && (
        <p className="mt-1 mb-0 text-center text-[11.5px] text-danger">
          Couldn&rsquo;t save right now. Try again.
        </p>
      )}
      {checkoutNotice && (
        <p className="mt-1 mb-0 text-center text-[11.5px] text-muted" role="status">
          {checkoutNotice}
        </p>
      )}
    </section>
  );
}
