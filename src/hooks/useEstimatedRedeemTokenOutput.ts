import type { Masset } from '@mstable/protocol/types/generated';
import { useMemo } from 'react';
import { useThrottleFn } from 'react-use';
import { sanitizeMassetError } from '../utils/strings';

import type { BigDecimalInputValues } from './useBigDecimalInputs';
import { BigDecimal } from '../web3/BigDecimal';
import { FetchState, useFetchState } from './useFetchState';

type RedeemableContract = Pick<Masset, 'getRedeemOutput'>;

interface RedeemOutput {
  estimatedOutputAmount: FetchState<BigDecimal>;
  exchangeRate: FetchState<BigDecimal>;
}

/**
 * This hook is designed for use with contracts that support redeem
 */
export const useEstimatedRedeemTokenOutput = (
  contract?: RedeemableContract,
  inputAmount?: BigDecimal,
  outputValues?: BigDecimalInputValues,
): RedeemOutput => {
  const [
    estimatedOutputAmount,
    setEstimatedOutputAmount,
  ] = useFetchState<BigDecimal>();

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _contract?: RedeemableContract,
      _outputValues?: BigDecimalInputValues,
      _inputAmount?: BigDecimal,
    ) => {
      if (!_outputValues || !_inputAmount) return;
      if (!_contract) return setEstimatedOutputAmount.fetching();

      const address = Object.keys(_outputValues)?.[0];
      const { decimals } = _outputValues[address];

      if (_inputAmount?.simple) {
        return _contract
          .getRedeemOutput(address, _inputAmount.exact)
          .then(_amount => {
            setEstimatedOutputAmount.value(new BigDecimal(_amount, decimals));
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error));
          });
      }

      setEstimatedOutputAmount.value();
    },
    1000,
    [contract, outputValues, inputAmount],
  );

  const exchangeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (!inputAmount) return {};

    if (!estimatedOutputAmount) return { fetching: true };

    const value = estimatedOutputAmount.value?.divPrecisely(inputAmount);
    return { value };
  }, [estimatedOutputAmount, inputAmount]);

  return { estimatedOutputAmount, exchangeRate };
};
