import { useMemo } from 'react';
import {
  getPenaltyMessage,
  getPenaltyPercentage,
} from '../components/pages/amm/utils';
import { BigDecimal } from '../web3/BigDecimal';

interface Output {
  maxOutputAmount?: BigDecimal;
  penaltyBonus: {
    percentage?: number;
    message?: string;
  };
}

/**
 * This hook returns maxOutputAmount + penaltyBonus
 *
 * @param slippageSimple Initial BigDecimal value (optional)
 * @param inputAmount Initial BigDecimal value (optional)
 * @param outputAmount Initial BigDecimal value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useMaximumOutput = (
  slippageSimple?: number | undefined,
  inputAmount?: BigDecimal | undefined,
  outputAmount?: BigDecimal | undefined,
): Output => {
  const { maxOutputAmount } = useMemo(() => {
    const _maxOutputAmount = BigDecimal.maybeParse(
      outputAmount && slippageSimple
        ? (outputAmount.simple * (1 + slippageSimple / 100)).toFixed(
            outputAmount.decimals,
          )
        : undefined,
    );

    return {
      maxOutputAmount: _maxOutputAmount,
    };
  }, [outputAmount, slippageSimple]);

  const penaltyBonusPercentage = useMemo<number | undefined>(
    () => getPenaltyPercentage(inputAmount, outputAmount, true),
    [inputAmount, outputAmount],
  );

  const penaltyBonusMessage = useMemo<string | undefined>(
    () => getPenaltyMessage(penaltyBonusPercentage),
    [penaltyBonusPercentage],
  );

  return {
    maxOutputAmount,
    penaltyBonus: {
      percentage: penaltyBonusPercentage,
      message: penaltyBonusMessage,
    },
  };
};
