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
      className="mt-10 rounded-lg bg-panel p-12 max-xl:sticky max-xl:top-5 max-xl:mt-0 max-xl:p-6 max-md:static max-md:mt-8 max-md:rounded-none max-md:px-[15px] max-md:py-6"
      aria-label="Your security system review"
    >
      <div className="grid grid-cols-1 items-start gap-12 max-xl:gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <Typography variant="eyebrow" className="mb-1.5 hidden max-xl:block">
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
            <div className="flex flex-col gap-1">
              {categoryOrder
                .filter((category) => lineItemsByCategory[category]?.length)
                .map((category) => (
                  <div key={category}>
                    <Typography variant="label">{category}</Typography>
                    {lineItemsByCategory[category].map((item) => (
                      <ReviewLineItem
                        key={item.key}
                        item={item}
                        onQuantityChange={onQuantityChange}
                      />
                    ))}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-[13px] leading-normal text-muted">
              Nothing selected yet — choose cameras, sensors, and accessories to build your system.
            </p>
          )}

          <div className="flex items-center gap-2.5 pt-1.5">
            <div
              className={
                shippingIconUrl
                  ? "flex h-8 w-8 shrink-0 items-center justify-center"
                  : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ship"
              }
            >
              {shippingIconUrl ? (
                <AppImage src={shippingIconUrl} alt="" decorative className="h-full w-full object-contain" />
              ) : (
                <TruckIcon className="h-[17px] w-[17px] text-success" />
              )}
            </div>
            <div className="flex-1 text-[13.5px] font-semibold text-ink">Fast Shipping</div>
            <Price
              amountCents={0}
              compareAtCents={shippingOriginalCents}
              tone="review"
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-5 max-xs:gap-3.5">
            <div
              className={
                guaranteeIconUrl
                  ? "h-[78px] w-[78px] shrink-0"
                  : "flex h-[76px] w-[76px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-full bg-accent-soft text-center"
              }
            >
              {guaranteeIconUrl ? (
                <AppImage
                  src={guaranteeIconUrl}
                  alt="100% Wyze satisfaction guarantee. Try worry-free for 30 days."
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <BadgeCheckIcon className="h-5 w-5 text-accent" />
                  <span className="text-[8.5px] font-bold leading-tight text-accent uppercase">
                    100%
                    <br />
                    satisfaction
                    <br />
                    guarantee
                  </span>
                </>
              )}
            </div>
            <div className="min-w-0 flex-[1_1_240px] max-xl:hidden">
              <Typography variant="title" as="h3" className="mb-1.5">
                30-day hassle-free returns
              </Typography>
              <Typography variant="subheading">
                If you&rsquo;re not totally in love with the product, we will refund you 100%.
              </Typography>
            </div>

            <div className="mt-6 flex w-full flex-[1_1_100%] items-baseline justify-between gap-4 max-xl:mt-0 max-xl:flex-1 max-xl:flex-col max-xl:items-end max-xl:gap-1.5" aria-live="polite" aria-atomic="true">
              <span className="rounded-pill bg-accent px-2.5 py-1 text-[10.5px] font-bold whitespace-nowrap text-white">
                as low as {formatCents(financingPerMonthCents)}/mo
              </span>
              <Price
                amountCents={totalCents}
                compareAtCents={originalTotalCents}
                tone="total"
              />
            </div>
          </div>

          {savingsCents > 0 && (
            <p className="mt-2.5 mb-0 text-center text-[12.5px] font-semibold text-success">
              Congrats! You&rsquo;re saving {formatCents(savingsCents)} on your security bundle!
            </p>
          )}

          <Button
            variant="primary"
            fullWidth
            className="mt-3"
            onClick={onCheckout}
            disabled={!canCheckout}
          >
            Checkout
          </Button>

          <Button variant="link" className="mx-auto mt-3 block w-fit" onClick={onSave}>
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
        </div>
      </div>
    </section>
  );
}
