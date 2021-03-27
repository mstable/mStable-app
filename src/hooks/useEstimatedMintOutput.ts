import type { FeederPool, Masset } from '@mstable/protocol/types/generated';
import type { BigNumber } from 'ethers';
import { useThrottleFn } from 'react-use';

import { sanitizeMassetError } from '../utils/strings';
import { BigDecimal } from '../web3/BigDecimal';

import type { BigDecimalInputValues } from './useBigDecimalInputs';
import { FetchState, useFetchState } from './useFetchState';

type MintableContract = Masset | FeederPool;

/**
 * This hook is designed for use with contracts that support mint & mintMulti
 */
export const useEstimatedMintOutput = (
  contract?: MintableContract,
  inputValues?: BigDecimalInputValues,
): FetchState<BigDecimal> => {
  const [
    estimatedOutputAmount,
    setEstimatedOutputAmount,
  ] = useFetchState<BigDecimal>();

  useThrottleFn(
    (_contract?: MintableContract, _inputValues?: BigDecimalInputValues) => {
      if (!_inputValues) return;
      if (!_contract) return setEstimatedOutputAmount.fetching();

      const touched = Object.values(_inputValues).filter(v => v.touched);

      if (touched.length) {
        setEstimatedOutputAmount.fetching();

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
            setEstimatedOutputAmount.value(new BigDecimal(mintOutput));
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error));
          });
      }
      setEstimatedOutputAmount.value();
    },
    2500,
    [contract, inputValues],
  );

  return estimatedOutputAmount;
};
