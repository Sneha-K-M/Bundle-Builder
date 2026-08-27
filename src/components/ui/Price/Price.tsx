import { formatCents } from "../../../utils/money";
import { cx } from "../../../utils/cx";

type PriceTone = "card" | "review" | "total";
type PriceLayout = "inline" | "stack";

type PriceProps = {
  amountCents: number;
  compareAtCents?: number;
  suffix?: string;
  freeLabel?: string;
  tone?: PriceTone;
  layout?: PriceLayout;
  className?: string;
};

export default function Price({
  amountCents,
  compareAtCents,
  suffix = "",
  freeLabel = "FREE",
  tone = "card",
  layout = "inline",
  className,
}: PriceProps) {
  const showStrike = compareAtCents != null && compareAtCents > amountCents;
  const display = amountCents === 0 ? freeLabel : `${formatCents(amountCents)}${suffix}`;

  return (
    <span
      className={cx(
        "flex whitespace-nowrap",
        layout === "inline" && "flex-row items-baseline gap-1.5",
        layout === "stack" && "flex-col items-end gap-px",
        tone === "total" && layout === "inline" && "gap-2",
        tone === "card" && layout === "inline" && "md:max-xl:flex-col md:max-xl:items-end md:max-xl:gap-px",
        className
      )}
    >
      {showStrike && compareAtCents != null && (
        <span
          className={cx(
            "line-through",
            tone === "card" && "text-[12.5px] text-was",
            tone === "review" && "text-[11px] text-strike",
            tone === "total" && "text-[15px] text-strike"
          )}
        >
          {formatCents(compareAtCents)}
        </span>
      )}
      <span
        className={cx(
          "font-bold",
          tone === "card" && "text-sm text-ink",
          tone === "review" && "text-[13.5px] text-review",
          tone === "total" && "text-[26px] font-extrabold text-accent"
        )}
      >
        {display}
      </span>
    </span>
  );
}
