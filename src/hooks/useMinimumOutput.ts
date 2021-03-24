import { useMemo } from 'react';
import {
  getPenaltyMessage,
  getPenaltyPercentage,
} from '../components/pages/amm/utils';
import { BigDecimal } from '../web3/BigDecimal';

interface Output {
  minOutputAmount?: BigDecimal;
  penaltyBonus: {
    percentage?: number;
    message?: string;
  };
}

/**
 * This hook returns minOutputAmount + penaltyBonus
 *
 * @param slippageSimple Initial BigDecimal value (optional)
 * @param inputAmount Initial BigDecimal value (optional)
 * @param outputAmount Initial BigDecimal value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useMinimumOutput = (
  slippageSimple?: number | undefined,
  inputAmount?: BigDecimal | undefined,
  outputAmount?: BigDecimal | undefined,
): Output => {
  const { minOutputAmount } = useMemo(() => {
    const _minOutputAmount = BigDecimal.maybeParse(
      outputAmount && slippageSimple
        ? (outputAmount.simple * (1 - slippageSimple / 100)).toFixed(
            outputAmount.decimals,
          )
        : undefined,
      18,
    );

    return {
      minOutputAmount: _minOutputAmount,
    };
  }, [outputAmount, slippageSimple]);

  const penaltyBonusPercentage = useMemo<number | undefined>(
    () => getPenaltyPercentage(inputAmount, outputAmount),
    [inputAmount, outputAmount],
  );

  const penaltyBonusMessage = useMemo<string | undefined>(
    () => getPenaltyMessage(penaltyBonusPercentage),
    [penaltyBonusPercentage],
  );

  return {
    minOutputAmount,
    penaltyBonus: {
      percentage: penaltyBonusPercentage,
      message: penaltyBonusMessage,
    },
  };
};
