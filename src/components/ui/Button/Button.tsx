import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

export type ButtonVariant = "primary" | "outline" | "ghost" | "link" | "disclosure" | "chip";
export type ButtonSize = "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  active?: boolean;
  children: ReactNode;
};

const BASE_CLASS =
  "cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-[0.45]";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "rounded-md border-0 bg-accent px-3.5 py-3.5 text-[15px] font-bold text-inverse hover:bg-accent-hover disabled:hover:bg-accent",
  outline:
    "rounded-sm border-[1.5px] border-accent bg-white px-7 py-3 text-sm font-bold text-accent",
  ghost:
    "rounded-sm border-[1.5px] border-line-strong bg-white px-3 py-[7px] text-[12.5px] font-semibold text-muted hover:border-selected hover:text-ink",
  link:
    "rounded-none border-0 bg-transparent p-0 text-[12.5px] font-medium italic text-muted underline hover:text-ink",
  disclosure:
    "flex w-full flex-col gap-[3px] rounded-none border-0 bg-transparent p-0 text-left",
  chip:
    "box-border inline-flex h-[26px] w-[65px] shrink-0 items-center justify-center gap-[3px] overflow-hidden rounded-[2px] border-[0.5px] py-px pr-[3px] pl-[3px] text-[10px] font-normal tracking-[0.6px] leading-none",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  active = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        BASE_CLASS,
        VARIANT_CLASS[variant],
        variant === "ghost" && size === "md" && "px-7 py-3 text-sm font-bold",
        variant === "ghost" && active && "border-selected bg-accent-soft text-accent",
        variant === "chip" &&
          (active
            ? "border-variant bg-variant-bg text-ink"
            : "border-line-strong bg-white text-muted"),
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
