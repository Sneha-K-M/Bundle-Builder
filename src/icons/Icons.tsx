import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function CameraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="7" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17 10.5L21 8v8l-4-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="10" cy="12.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7V5.5A1.5 1.5 0 018.5 4h3A1.5 1.5 0 0113 5.5V7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3l7 3v5.2c0 4.6-3 8.3-7 9.8-4-1.5-7-5.2-7-9.8V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SensorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="14" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 14a4 4 0 018 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 10.5a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="6" cy="6" r="1.6" fill="currentColor" />
      <circle cx="12" cy="6" r="1.6" fill="currentColor" />
      <circle cx="18" cy="6" r="1.6" fill="currentColor" />
      <circle cx="6" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="18" cy="12" r="1.6" fill="currentColor" />
      <circle cx="6" cy="18" r="1.6" fill="currentColor" />
      <circle cx="12" cy="18" r="1.6" fill="currentColor" />
      <circle cx="18" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}

type ChevronDirection = "down" | "up" | "left" | "right";

const CHEVRON_ROTATION: Record<ChevronDirection, number> = {
  down: 0,
  up: 180,
  left: 90,
  right: -90,
};

export function ChevronIcon({
  direction = "down",
  ...props
}: IconProps & { direction?: ChevronDirection }) {
  const rotation = CHEVRON_ROTATION[direction];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      {...props}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="8" width="11" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.5 11h4l3 3v2h-7v-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BadgeCheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2.5l2.2 1.6 2.7-.2 1 2.5 2.4 1.3-.6 2.6 1.5 2.2-1.9 1.9.3 2.7-2.6.8-1 2.5-2.7-.4-2.2 1.6-2.2-1.6-2.7.4-1-2.5-2.6-.8.3-2.7-1.9-1.9 1.5-2.2-.6-2.6 2.4-1.3 1-2.5 2.7.2L12 2.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.5 12.2l2.3 2.3 4.2-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlaceholderProductIcon({ label, ...props }: IconProps & { label?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" role="img" aria-label={label} {...props}>
      <rect x="1" y="1" width="46" height="46" rx="10" fill="#EEF0FC" stroke="#D9DCF5" strokeWidth="1" />
      <rect x="14" y="16" width="20" height="16" rx="3" stroke="#8A8FC2" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="4.2" stroke="#8A8FC2" strokeWidth="1.6" />
      <rect x="19" y="12" width="10" height="4" rx="1.5" stroke="#8A8FC2" strokeWidth="1.4" />
    </svg>
  );
}
