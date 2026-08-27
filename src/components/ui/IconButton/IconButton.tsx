import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export default function IconButton({
  label,
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
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
