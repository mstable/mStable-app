import { IUniswapV2Router02__factory } from '@mstable/protocol/types/generated';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import { getUniswapBassetOutputForETH } from '../components/pages/Save/v2/UniswapBassetOut';
import { ADDRESSES, SCALE } from '../constants';
import { useSelectedMassetState } from '../context/DataProvider/DataProvider';
import { useSigner } from '../context/OnboardProvider';

import { BigDecimal } from '../web3/BigDecimal';

interface Output {
  uniswapExchangeRate?: { fetching?: boolean; value?: BigDecimal };
}

/**
 * This hook is designed for use with SaveDeposit
 *
 * @param inputAmount Initial BigDecimal value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useUniswapOutput = (
  inputAmount?: BigDecimal | undefined,
): Output => {
  const signer = useSigner();
  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;

  const [uniswapOutputAmount, setUniswapAmountOut] = useState<{
    fetching: boolean;
    amount?: BigNumber;
    error?: string;
  }>({ fetching: false });

  const uniswap = useMemo(
    () =>
      signer
        ? IUniswapV2Router02__factory.connect(
            ADDRESSES.UNISWAP_ROUTER02,
            signer,
          )
        : undefined,
    [signer],
  );

  const uniswapExchangeRate = useMemo<
    | {
        fetching?: boolean;
        value?: BigDecimal;
      }
    | undefined
  >(() => {
    if (!inputAmount || !uniswapOutputAmount?.amount) return;
    if (!saveExchangeRate || uniswapOutputAmount?.fetching)
      return { fetching: true };

    const uniswapRate = uniswapOutputAmount?.amount
      ?.mul(SCALE)
      .div(inputAmount.exact);

    return {
      value: new BigDecimal(uniswapRate).divPrecisely(saveExchangeRate),
    };
  }, [inputAmount, uniswapOutputAmount, saveExchangeRate]);

  useDebounce(
    () => {
      if (!inputAmount) return;
      if (uniswap && massetState) {
        getUniswapBassetOutputForETH(uniswap, inputAmount, massetState)
          .then(optimalBasset => {
            setUniswapAmountOut({
              amount: optimalBasset.normalizedAmountOut,
              fetching: false,
            });
          })
          .catch(_error => {
            setUniswapAmountOut({ error: _error, fetching: false });
          });
      }
    },
    2000,
    [inputAmount, signer, massetState],
  );

  useEffect(() => {
    if (!inputAmount) return;
    setUniswapAmountOut({ fetching: true });
  }, [inputAmount]);

  return { uniswapExchangeRate };
};
