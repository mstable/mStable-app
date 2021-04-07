import type { BigNumber } from 'ethers';
import { Signer } from 'ethers';
import { useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Masset__factory } from '@mstable/protocol/types/generated';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import { useSigner } from '../../../../context/OnboardProvider';

import { FetchState, useFetchState } from '../../../../hooks/useFetchState';
import { sanitizeMassetError } from '../../../../utils/strings';
import { BigDecimal } from '../../../../web3/BigDecimal';
import {
  SaveWrapper,
  SaveWrapper__factory,
  UniswapRouter02__factory,
} from '../../../../typechain';
import { ADDRESSES } from '../../../../constants';

import { SaveRoutes, SaveOutput } from './types';

const getOptimalBasset = async (
  saveWrapper: SaveWrapper,
  massetAddress: string,
  bAssets: MassetState['bAssets'],
  inputAmount: BigNumber,
): Promise<SaveOutput> => {
  const uniswap = UniswapRouter02__factory.connect(
    ADDRESSES.UNISWAP_ROUTER02,
    saveWrapper.signer,
  );
  const bassetAmountsOut = [
    ...(await Promise.all(
      Object.keys(bAssets).map(async address => {
        const path = [ADDRESSES.WETH, address];
        try {
          const [, amountOut] = await uniswap.getAmountsOut(inputAmount, path);
          const estimatedOutput = await saveWrapper.estimate_saveViaUniswapETH(
            massetAddress,
            ADDRESSES.UNISWAP_ROUTER02,
            inputAmount,
            path,
          );

          return {
            path,
            amountOut: new BigDecimal(
              amountOut,
              bAssets[address].token.decimals,
            ),
            amount: new BigDecimal(estimatedOutput),
          };
        } catch (error) {
          console.error(
            `Error estimating Uniswap output for path ${path.join(',')}`,
            error,
          );
        }
      }),
    )),
  ].filter(Boolean) as SaveOutput[];

  const optimal = bassetAmountsOut.reduce((prev, current) =>
    current.amount.exact.gt(prev.amount.exact) ? current : prev,
  );

  if (!optimal) {
    throw new Error('No Uniswap path found');
  }

  return optimal;
};

export const useSaveOutput = (
  route?: SaveRoutes,
  inputAddress?: string,
  inputAmount?: BigDecimal,
): FetchState<SaveOutput> => {
  const [saveOutput, setSaveOutput] = useFetchState<SaveOutput>();

  const signer = useSigner() as Signer;

  const massetState = useSelectedMassetState() as MassetState;
  const {
    address: massetAddress,
    bAssets,
    savingsContracts: {
      v2: { latestExchangeRate: { rate: latestExchangeRate } = {} },
    },
  } = massetState;

  const inputAmountSerialized = inputAmount?.toJSON();
  const [update] = useDebounce(
    () => {
      if (!inputAmountSerialized || !inputAddress) return setSaveOutput.value();
      const _inputAmount = BigDecimal.fromJSON(inputAmountSerialized);

      if (!latestExchangeRate) return setSaveOutput.fetching();

      let promise: Promise<SaveOutput>;
      switch (route) {
        case SaveRoutes.Save:
        case SaveRoutes.Stake:
        case SaveRoutes.SaveAndStake:
          promise = Promise.resolve({
            amount: _inputAmount,
          });
          break;

        case SaveRoutes.BuyAndSave:
        case SaveRoutes.BuyAndStake:
          promise = getOptimalBasset(
            SaveWrapper__factory.connect(ADDRESSES.SAVE_WRAPPER, signer),
            massetAddress,
            bAssets,
            _inputAmount.exact,
          );
          break;

        case SaveRoutes.MintAndSave:
        case SaveRoutes.MintAndStake:
          promise = (async () => {
            const mintOutput = await Masset__factory.connect(
              massetAddress,
              signer,
            ).getMintOutput(inputAddress, _inputAmount.exact);
            return {
              amount: new BigDecimal(mintOutput),
            };
          })();
          break;

        default:
          return setSaveOutput.value();
      }

      setSaveOutput.fetching();

      return promise
        .then((output): void => {
          setSaveOutput.value(output);
        })
        .catch((_error: Error): void => {
          setSaveOutput.error(sanitizeMassetError(_error));
        });
    },
    1000,
    [inputAmountSerialized, inputAddress, massetAddress],
  );

  useEffect(() => {
    if (inputAmount?.exact.gt(0) && inputAddress) {
      setSaveOutput.fetching();
      update();
    } else {
      setSaveOutput.value();
    }
  }, [inputAddress, inputAmount, setSaveOutput, update]);

  return saveOutput;
};
