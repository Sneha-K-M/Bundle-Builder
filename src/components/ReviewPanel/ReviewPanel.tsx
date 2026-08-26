import { BadgeCheckIcon, TruckIcon } from "../../icons/Icons";
import type { Catalog, QuantityHandler, SaveStatus, Selections } from "../../types/bundle";
import { iconUrl } from "../../utils/assets";
import { computeTotals, formatCurrency } from "../../utils/pricing";
import ReviewLineItem from "../ReviewLineItem/ReviewLineItem";

import styles from "./ReviewPanel.module.css";

const CATEGORY_ORDER = ["Cameras", "Sensors", "Accessories", "Plan"] as const;
const SHIPPING_ORIGINAL = 5.99;

interface ReviewPanelProps {
  catalog: Catalog;
  selections: Selections;
  onIncrement: QuantityHandler;
  onDecrement: QuantityHandler;
  onSave: () => void;
  saveStatus: SaveStatus;
}

export default function ReviewPanel({
  catalog,
  selections,
  onIncrement,
  onDecrement,
  onSave,
  saveStatus,
}: ReviewPanelProps) {
  const { lineItemsByCategory, subtotal, originalSubtotal, savings, financingPerMonth } =
    computeTotals(selections, catalog);

  const total = subtotal;
  const originalTotal = originalSubtotal + SHIPPING_ORIGINAL;
  const hasAnyItems = Object.values(lineItemsByCategory).some((list) => list.length > 0);

  const saveLabel = saveStatus === "saved" ? "Saved!" : "Save my system for later";
  const shippingIconUrl = iconUrl("truck");
  const guaranteeIconUrl = iconUrl("badge-check");

  return (
    <section className={styles.panel} aria-label="Your security system review">
      <div className={styles.inner}>
        <div className={styles.summary}>
          <p className={styles.eyebrow}>REVIEW</p>
          <h2 className={styles.heading}>Your security system</h2>
          <p className={styles.subheading}>
            Review your personalized protection system designed to keep what matters most safe.
          </p>

          <div className={styles.divider} />

          {hasAnyItems ? (
            CATEGORY_ORDER.filter((cat) => lineItemsByCategory[cat]?.length).map((category) => (
              <div key={category} className={styles.section}>
                <p className={styles.sectionLabel}>{category.toUpperCase()}</p>
                {lineItemsByCategory[category].map((item) => (
                  <ReviewLineItem
                    key={item.key}
                    item={item}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                  />
                ))}
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>
              Nothing selected yet — choose cameras, sensors, and accessories to build your system.
            </p>
          )}

          <div className={styles.utilityRow}>
            <div className={styles.utilityIcon}>
              {shippingIconUrl ? (
                <img src={shippingIconUrl} alt="" className={styles.icon} />
              ) : (
                <TruckIcon className={styles.icon} />
              )}
            </div>
            <div className={styles.utilityLabel}>Fast Shipping</div>
            <div className={styles.pricing}>
              <span className={styles.strike}>{formatCurrency(SHIPPING_ORIGINAL)}</span>
              <span className={styles.freePrice}>FREE</span>
            </div>
          </div>
        </div>

        <div className={styles.order}>
          <div className={styles.guaranteeRow}>
            <div className={styles.guaranteeBadge}>
              {guaranteeIconUrl ? (
                <img src={guaranteeIconUrl} alt="" className={styles.guaranteeIcon} />
              ) : (
                <BadgeCheckIcon className={styles.guaranteeIcon} />
              )}
              <span className={styles.guaranteeText}>
                100%
                <br />
                satisfaction
                <br />
                guarantee
              </span>
            </div>
            <div className={styles.returns}>
              <h3 className={styles.returnsTitle}>30-day hassle-free returns</h3>
              <p className={styles.returnsCopy}>
                If you&rsquo;re not totally in love with the product, we will refund you 100%.
              </p>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.financingPill}>
                as low as {formatCurrency(financingPerMonth)}/mo
              </span>
              <div className={styles.totalBlock}>
                {originalTotal > total && (
                  <span className={styles.totalStrike}>{formatCurrency(originalTotal)}</span>
                )}
                <span className={styles.total}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {savings > 0 && (
            <p className={styles.savings}>
              Congrats! You&rsquo;re saving {formatCurrency(savings)} on your security bundle!
            </p>
          )}

          <button type="button" className={styles.checkoutBtn}>
            Checkout
          </button>

          <button type="button" className={styles.saveLink} onClick={onSave}>
            {saveLabel}
          </button>
          {saveStatus === "restored" && (
            <p className={styles.restoredNote}>Restored your saved system.</p>
          )}
          {saveStatus === "error" && (
            <p className={styles.errorNote}>Couldn&rsquo;t save right now. Try again.</p>
          )}
        </div>
      </div>
    </section>
  );
}
