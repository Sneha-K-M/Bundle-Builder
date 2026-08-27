import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

type ButtonVariant = "primary" | "outline" | "ghost" | "link";
type ButtonSize = "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  active?: boolean;
  children: ReactNode;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "border-0 bg-accent text-inverse hover:bg-accent-hover disabled:hover:bg-accent",
  outline:
    "border-[1.5px] border-accent bg-white text-accent hover:bg-accent-soft",
  ghost:
    "border-[1.5px] border-line-strong bg-white text-muted hover:border-selected hover:text-ink",
  link:
    "border-0 bg-transparent p-0 text-[12.5px] font-semibold text-muted underline hover:text-ink",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: "px-7 py-3 text-sm font-bold",
  sm: "px-3 py-[7px] text-[12.5px] font-semibold",
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
        "rounded-sm transition-colors disabled:cursor-not-allowed disabled:opacity-[0.45]",
        VARIANT_CLASS[variant],
        variant !== "link" && SIZE_CLASS[size],
        variant === "primary" && size === "md" && "px-3.5 py-3.5 text-[15px]",
        variant === "ghost" && active && "border-selected bg-accent-soft text-accent",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
