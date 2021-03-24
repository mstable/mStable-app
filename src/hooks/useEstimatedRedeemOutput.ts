import { Masset } from '@mstable/protocol/types/generated';
import { useMemo, useState } from 'react';
import { useThrottleFn } from 'react-use';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
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
 * This hook is designed for use with contracts that support redeemExact
 *
 * @param inputAmount Initial BigDecimal value (optional)
 * @param inputAddress Initial string value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useEstimatedRedeemOutput = (
  contract?: RedeemableContract,
  inputValues?: BigDecimalInputValues,
): Output => {
  const massetState = useSelectedMassetState();
  const [estimatedOutputAmount, setEstimatedOutputAmount] = useState<{
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  }>({});

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (_contract?: RedeemableContract, _inputValues?: BigDecimalInputValues) => {
      if (!_inputValues) return;
      if (!_contract) return setEstimatedOutputAmount({ fetching: true });

      const touched = Object.values(_inputValues).filter(v => v.touched);

      if (touched.length) {
        setEstimatedOutputAmount({ fetching: true });

        const promise = (() => {
          const inputs = touched.map(v => v.address);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);
          return _contract.getRedeemExactBassetsOutput(inputs, amounts);
        })();

        return promise
          .then(_amount => {
            setEstimatedOutputAmount({
              value: new BigDecimal(_amount),
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
    [contract, inputValues],
  );

  const exchangeRate = useMemo<
    | {
        fetching?: boolean;
        value?: BigDecimal;
      }
    | undefined
  >(() => {
    if (!inputValues || !estimatedOutputAmount || !massetState) return;

    const touched = Object.values(inputValues).filter(v => v.touched);
    if (!touched.length) return;

    if (touched.length) {
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
        const value = estimatedOutputAmount.value?.divPrecisely(totalAmount);
        return { value };
      }
    }
  }, [estimatedOutputAmount, inputValues, massetState]);

  return { estimatedOutputAmount, exchangeRate };
};
