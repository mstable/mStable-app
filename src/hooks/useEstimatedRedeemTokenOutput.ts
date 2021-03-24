import { Masset } from '@mstable/protocol/types/generated';
import { useMemo, useState } from 'react';
import { useThrottleFn } from 'react-use';
import { sanitizeMassetError } from '../utils/strings';

import { BigDecimal } from '../web3/BigDecimal';
import { BigDecimalInputValues } from './useBigDecimalInputs';

type RedeemableContract = Masset;

interface Output {
  estimatedOutputAmount: {
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  };
  exchangeRate?: { fetching?: boolean; value?: BigDecimal };
}

/**
 * This hook is designed for use with contracts that support redeem
 *
 * @param inputAmount Initial BigDecimal value (optional)
 * @param inputAddress Initial string value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useEstimatedRedeemTokenOutput = (
  contract?: RedeemableContract,
  inputAmount?: BigDecimal,
  outputValues?: BigDecimalInputValues,
): Output => {
  const [estimatedOutputAmount, setEstimatedOutputAmount] = useState<{
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  }>({});

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (
      _contract?: RedeemableContract,
      _outputValues?: BigDecimalInputValues,
      _inputAmount?: BigDecimal,
    ) => {
      if (!_outputValues || !_inputAmount) return;
      if (!_contract) return setEstimatedOutputAmount({ fetching: true });

      const address = Object.keys(_outputValues)?.[0];
      const { decimals } = _outputValues[address];

      if (_inputAmount?.simple) {
        return _contract
          .getRedeemOutput(address, _inputAmount.exact)
          .then(_amount => {
            setEstimatedOutputAmount({
              value: new BigDecimal(_amount, decimals),
            });
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount({
              error: sanitizeMassetError(_error),
            });
          });
      }
      setEstimatedOutputAmount({});
    },
    1000,
    [contract, outputValues, inputAmount],
  );

  const exchangeRate = useMemo<
    | {
        fetching?: boolean;
        value?: BigDecimal;
      }
    | undefined
  >(() => {
    if (!inputAmount) return;
    if (!estimatedOutputAmount) return { fetching: true };

    const value = estimatedOutputAmount.value?.divPrecisely(inputAmount);
    return { value };
  }, [estimatedOutputAmount, inputAmount]);

  return { estimatedOutputAmount, exchangeRate };
};
