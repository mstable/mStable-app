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
  // Use strict equality checks for deps for the same reason
  const output = Object.values(outputValues ?? {})[0];
  const outputAddress = output?.address;
  const outputDecimals = output?.decimals;
  const inputAmt = inputAmount?.exact.toString();
  useThrottleFn(
    (
      _contract?: RedeemableContract,
      _inputAmt?: string,
      _outputAddress?: string,
      _outputDecimals?: number,
    ) => {
      if (!_outputDecimals || !_inputAmt) return;
      if (!_contract) return setEstimatedOutputAmount.fetching();

      if (_outputDecimals && _outputAddress && _inputAmt) {
        setEstimatedOutputAmount.fetching();
        return _contract
          .getRedeemOutput(_outputAddress, _inputAmt)
          .then(_amount => {
            setEstimatedOutputAmount.value(
              new BigDecimal(_amount, _outputDecimals),
            );
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error));
          });
      }

      setEstimatedOutputAmount.value();
    },
    1000,
    [contract, inputAmt, outputAddress, outputDecimals],
  );

  const exchangeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (!inputAmount) return {};

    if (!estimatedOutputAmount) return { fetching: true };

    const value = estimatedOutputAmount.value?.divPrecisely(inputAmount);
    return { value };
  }, [estimatedOutputAmount, inputAmount]);

  return { estimatedOutputAmount, exchangeRate };
};
