import type { ElementType, ReactNode } from "react";
import { cx } from "../../../utils/cx";

export type TypographyVariant =
  | "display"
  | "heading"
  | "title"
  | "subheading"
  | "body"
  | "body-small"
  | "caption"
  | "label"
  | "eyebrow"
  | "price";

type TypographyProps = {
  variant: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

const DEFAULT_TAG: Record<TypographyVariant, ElementType> = {
  display: "h2",
  heading: "h2",
  title: "h3",
  subheading: "p",
  body: "p",
  "body-small": "p",
  caption: "p",
  label: "p",
  eyebrow: "p",
  price: "span",
};

const VARIANT_CLASS: Record<TypographyVariant, string> = {
  display: "m-0 text-[22px] font-extrabold leading-[1.2] text-ink",
  heading: "m-0 text-xl font-bold leading-[1.25] text-ink",
  title: "m-0 text-[15px] font-bold leading-[1.3] text-ink",
  subheading: "m-0 text-[13px] font-normal leading-normal text-muted",
  body: "m-0 text-[12.5px] leading-[1.45] text-muted",
  "body-small": "m-0 text-[13.5px] font-semibold leading-snug text-ink",
  caption: "m-0 text-[12.5px] leading-snug text-muted",
  label: "m-0 text-[10.5px] font-bold tracking-[0.07em] text-subtle uppercase",
  eyebrow: "m-0 text-[11px] font-bold tracking-[0.08em] text-subtle uppercase",
  price: "whitespace-nowrap text-sm font-bold text-ink",
};

export default function Typography({
  variant,
  as,
  children,
  className,
}: TypographyProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  return <Tag className={cx(VARIANT_CLASS[variant], className)}>{children}</Tag>;
}
