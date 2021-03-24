import type { FeederPool, Masset } from '@mstable/protocol/types/generated';
import { useThrottleFn } from 'react-use';
import { sanitizeMassetError } from '../utils/strings';

import type { BigDecimalInputValues } from './useBigDecimalInputs';
import { BigDecimal } from '../web3/BigDecimal';

import { FetchState, useFetchState } from './useFetchState';
import { useExchangeRateForMassetInputs } from './useMassetExchangeRate';

type RedeemableContract =
  | Pick<Masset, 'getRedeemExactBassetsOutput'>
  | Pick<FeederPool, 'getRedeemExactBassetsOutput'>;

interface RedeemOutput {
  estimatedOutputAmount: FetchState<BigDecimal>;
  exchangeRate: FetchState<BigDecimal> | undefined;
}

/**
 * This hook is designed for use with contracts that support redeemExact
 */
export const useEstimatedRedeemOutput = (
  contract?: RedeemableContract,
  inputValues?: BigDecimalInputValues,
): RedeemOutput => {
  const [
    estimatedOutputAmount,
    setEstimatedOutputAmount,
  ] = useFetchState<BigDecimal>();

  // Get the swap output with a throttle so it's not called too often
  useThrottleFn(
    (_contract?: RedeemableContract, _inputValues?: BigDecimalInputValues) => {
      if (!_inputValues) return;
      if (!_contract) return setEstimatedOutputAmount.fetching();

      const touched = Object.values(_inputValues).filter(v => v.touched);

      if (touched.length) {
        setEstimatedOutputAmount.fetching();

        const promise = (() => {
          const inputs = touched.map(v => v.address);
          const amounts = touched.map(v => (v.amount as BigDecimal).exact);
          return _contract.getRedeemExactBassetsOutput(inputs, amounts);
        })();

        return promise
          .then(_amount => {
            setEstimatedOutputAmount.value(new BigDecimal(_amount));
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error));
          });
      }
      setEstimatedOutputAmount.value();
    },
    1000,
    [contract, inputValues],
  );

  const exchangeRate = useExchangeRateForMassetInputs(
    estimatedOutputAmount.value,
    inputValues,
  );

  return { estimatedOutputAmount, exchangeRate };
};
