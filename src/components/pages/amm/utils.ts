const MIN_FACTOR = 0.996;
const MAX_FACTOR = 1.004;

export const getBounds = (amount: number): { min: number; max: number } => {
  const min = amount * MIN_FACTOR;
  const max = amount * MAX_FACTOR;
  return { min, max };
};

export const getEstimatedOutput = (
  amount: number | undefined,
  slippage: number | undefined,
): number | undefined => {
  if (!amount || !slippage) return;
  return amount / (1 - slippage / 100);
};

export const getPenaltyMessage = (
  amount: number | undefined,
): string | undefined => {
  if (!amount) return undefined;

  const abs = Math.abs(amount).toFixed(4);
  return amount > 0
    ? `WARNING: There is a price bonus of +${abs}%`
    : `WARNING: There is a price penalty of -${abs}%`;
};
