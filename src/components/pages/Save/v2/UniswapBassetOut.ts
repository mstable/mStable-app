import { IUniswapV2Router02 } from '@mstable/protocol/types/generated';
import { BigNumber } from 'ethers';
import { ADDRESSES, RATIO_SCALE } from '../../../../constants';
import { MassetState } from '../../../../context/DataProvider/types';
import { BigDecimal } from '../../../../web3/BigDecimal';

interface UniswapBassetOutput {
  path: [string, string];
  amountOut: BigNumber;
  normalizedAmountOut: BigNumber;
  position: number;
}

export const getUniswapBassetOutputForETH = async (
  uniswap: IUniswapV2Router02,
  inputAmount: BigDecimal,
  massetState: MassetState,
): Promise<UniswapBassetOutput> => {
  const bassetAmountsOut = [
    ...(await Promise.all(
      ADDRESSES.CURVE['3POOL_COINS'].map(async (address, position) => {
        try {
          const path = [ADDRESSES.WETH, address];

          const [, amountOut] = await uniswap.getAmountsOut(
            inputAmount.exact,
            path,
          );

          const { ratio } = massetState.bAssets[address];
          const normalizedAmountOut = amountOut.mul(ratio).div(RATIO_SCALE);

          return {
            path,
            normalizedAmountOut,
            amountOut,
            position: position + 1, // position 0 is mUSD
          };
        } catch {
          //
        }
      }),
    )),
  ].filter(Boolean) as UniswapBassetOutput[];

  const optimalBasset = bassetAmountsOut.reduce((prev, current) =>
    current.normalizedAmountOut.gt(prev.normalizedAmountOut) ? current : prev,
  );

  if (!optimalBasset) {
    throw new Error('No Uniswap path found');
  }

  return optimalBasset;
};
