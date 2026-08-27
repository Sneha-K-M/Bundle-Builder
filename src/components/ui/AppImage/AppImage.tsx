import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";

type AppImageProps = {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  decorative?: boolean;
  objectFit?: "contain" | "cover";
  fallback?: ReactNode;
};

export default function AppImage({
  src,
  alt,
  className,
  width,
  height,
  loading = "lazy",
  decorative = false,
  objectFit = "contain",
  fallback,
}: AppImageProps) {
  if (!src) return <>{fallback}</>;

  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      className={cx("block max-w-full", objectFit === "cover" ? "object-cover" : "object-contain", className)}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
    />
  );
}
