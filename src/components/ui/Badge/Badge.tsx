import { cx } from "../../../utils/cx";

type BadgeProps = {
  children: string;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cx(
        "absolute top-0 left-0 z-[1] inline-flex h-[19px] w-[65px] items-center justify-center rounded-[10px] bg-badge px-1.5 py-0.5 text-[11px] font-bold tracking-[0.01em] whitespace-nowrap text-white",
        className
      )}
    >
      {children}
    </span>
  );
}
