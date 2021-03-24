import { useMemo } from 'react';

import type { FeederPool, Masset } from '@mstable/protocol/types/generated';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { BigDecimal } from '../web3/BigDecimal';

import type { FetchState } from './useFetchState';
import type {
  BigDecimalInputValue,
  BigDecimalInputValues,
} from './useBigDecimalInputs';

type Contract = FeederPool | Masset;

export const useExchangeRateForMassetInputs = (
  contract?: Contract,
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

    // Scale asset via ratio
    const scaleAssetValue = (input: BigDecimalInputValue): BigDecimal => {
      const { address, amount } = input;
      if (!amount) return BigDecimal.ZERO;

      const isFeederAsset =
        massetState.feederPools[contract?.address ?? '']?.fasset.address ===
        address;

      if (isFeederAsset && contract) {
        const ratio = massetState.feederPools[contract.address]?.fasset.ratio;
        return ratio ? amount.mulRatioTruncate(ratio) : amount;
      }
      if (massetState.bAssets[address]) {
        const ratio = massetState.bAssets[address]?.ratio;
        return ratio ? amount.mulRatioTruncate(ratio) : amount;
      }
      return amount;
    };

    const totalAmount = Object.values(touched).reduce(
      (prev, v) => prev.add(scaleAssetValue(v)),
      BigDecimal.ZERO,
    );

    if (totalAmount) {
      const value = estimatedOutputAmount.divPrecisely(totalAmount);
      return { value };
    }
  }, [estimatedOutputAmount, inputValues, massetState, contract]);
};
