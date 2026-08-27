import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

export type IconButtonVariant = "stepper";
export type IconButtonSize = "md" | "sm";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
};

const VARIANT_CLASS: Record<IconButtonVariant, string> = {
  stepper:
    "border border-line-strong bg-white leading-none text-muted hover:bg-stepper-hover hover:text-ink disabled:bg-stepper disabled:hover:bg-stepper disabled:hover:text-muted",
};

const SIZE_CLASS: Record<IconButtonSize, string> = {
  md: "h-8 w-8 min-h-8 min-w-8 rounded-[5px] text-base",
  sm: "h-6 w-6 min-h-6 min-w-6 rounded-[4px] text-sm",
};

export default function IconButton({
  label,
  variant = "stepper",
  size = "md",
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(
        "inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-35",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
