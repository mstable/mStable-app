import { useMemo } from 'react';

import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { BigDecimal } from '../web3/BigDecimal';

import type { FetchState } from './useFetchState';
import type { BigDecimalInputValues } from './useBigDecimalInputs';

export const useExchangeRateForMassetInputs = (
  estimatedOutputAmount?: BigDecimal,
  inputValues?: BigDecimalInputValues,
): FetchState<BigDecimal> | undefined => {
  const massetState = useSelectedMassetState();

  return useMemo<FetchState<BigDecimal> | undefined>(() => {
    if (!inputValues || !massetState) {
      return;
    }

    const touched = Object.values(inputValues).filter(v => v.touched);

    if (!touched.length) return;
    if (!estimatedOutputAmount) return { fetching: true };

    const totalAmount = Object.values(touched).reduce(
      (prev, v) =>
        prev.add(
          (v.amount as BigDecimal).mulRatioTruncate(
            massetState.bAssets[v.address].ratio,
          ),
        ),
      BigDecimal.ZERO,
    );

    if (totalAmount) {
      const value = estimatedOutputAmount.divPrecisely(totalAmount);
      return { value };
    }
  }, [estimatedOutputAmount, inputValues, massetState]);
};
