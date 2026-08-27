const CENTS_PER_DOLLAR = 100;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function dollarsToCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * CENTS_PER_DOLLAR);
}

export function centsToDollars(cents: number): number {
  return cents / CENTS_PER_DOLLAR;
}

export function formatCents(cents: number): string {
  return usd.format(centsToDollars(cents));
}

export function clampQuantity(
  quantity: number,
  min: number,
  max = Number.POSITIVE_INFINITY
): number {
  if (!Number.isFinite(quantity)) return min;
  const whole = Math.trunc(quantity);
  return Math.min(max, Math.max(min, whole));
}
