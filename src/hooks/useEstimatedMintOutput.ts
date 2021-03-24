import { Masset } from '@mstable/protocol/types/generated';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useThrottleFn } from 'react-use';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { sanitizeMassetError } from '../utils/strings';

import { BigDecimal } from '../web3/BigDecimal';
import { BigDecimalInputValues } from './useBigDecimalInputs';

type MintableContract = Masset;

interface Output {
  estimatedOutputAmount: {
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  };
  exchangeRate?: { fetching?: boolean; value?: BigDecimal };
}

/**
 * This hook is designed for use with contracts that support mint & mintMulti
 *
 * @param inputAmount Initial BigDecimal value (optional)
 * @param inputAddress Initial string value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useEstimatedMintOutput = (
  contract?: MintableContract,
  inputValues?: BigDecimalInputValues,
): Output => {
  const [estimatedOutputAmount, setEstimatedOutputAmount] = useState<{
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  }>({});

  const massetState = useSelectedMassetState();

  useThrottleFn(
    (_contract?: MintableContract, _inputValues?: BigDecimalInputValues) => {
      if (!_inputValues) return;
      if (!_contract) return setEstimatedOutputAmount({ fetching: true });

      const touched = Object.values(_inputValues).filter(v => v.touched);

      if (touched.length) {
        setEstimatedOutputAmount({ fetching: true });

        const promise = (() => {
          if (touched.length === 1) {
            const [{ address, amount }] = touched;
            return _contract.getMintOutput(
              address,
              (amount as BigDecimal).exact,
            );
          }

          const inputs = touched.map(v => v.address);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);
          return _contract.getMintMultiOutput(inputs, amounts);
        })();

        return promise
          .then((mintOutput: BigNumber): void => {
            setEstimatedOutputAmount({
              value: new BigDecimal(mintOutput),
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
