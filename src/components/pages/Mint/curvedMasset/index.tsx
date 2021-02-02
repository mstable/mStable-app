import { BigNumber, bigNumberify } from 'ethers/utils';
import React, { FC, useMemo, useEffect } from 'react';
import {
  BannerMessage,
  useSetBannerMessage,
} from '../../../../context/AppProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { MultiAssetExchange } from '../../../forms/MultiAssetExchange';

export const Mint: FC = () => {
  const massetState = useSelectedMassetState();
  const setBannerMessage = useSetBannerMessage();

  const inputAssets = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(massetState?.bAssets ?? {}).map(
          ([
            address,
            {
              token: { decimals, balance, symbol },
            },
          ]) => [address, { decimals, balance, symbol }],
        ),
      ),
    [massetState],
  );

  const outputAssets = useMemo(() => {
    if (!massetState) return {};
    const { address, decimals, symbol } = massetState.token;
    return { [address]: { decimals, symbol } };
  }, [massetState]);

  const tvlCap = useMemo(() => {
    const _startTime = massetState?.invariantStartTime;
    const _startingCap = massetState?.invariantStartingCap;

    if (!_startTime || !_startingCap) return;

    const currentTime = new BigDecimal(Math.floor(Date.now() / 1e3).toString());
    const startingCap = new BigDecimal(_startingCap);
    const startTime = new BigDecimal(_startTime.toString());

    const weeksSinceLaunch = currentTime
      .sub(startTime)
      .mulTruncate((1e18).toString())
      .divPrecisely(new BigDecimal(604800));

    if (weeksSinceLaunch.exact.gt(new BigDecimal((12e18).toString()).exact))
      return;

    const maxK = startingCap.add(
      new BigDecimal(
        weeksSinceLaunch.exact
          .pow(bigNumberify(2))
          .div(new BigNumber((1e18).toString())),
      ),
    );
    return maxK;
  }, [massetState?.invariantStartTime, massetState?.invariantStartingCap]);

  useEffect(() => {
    if (!tvlCap) return;

    // TODO: - Add URL for TVL cap
    const message: BannerMessage = {
      title: `Current TVL cap is ${tvlCap.format(2, false)} mBTC. `,
      emoji: '⚠️',
      visible: true,
      url: '#',
    };

    setBannerMessage(message);
  }, [setBannerMessage, tvlCap]);

  return (
    <div>
      <MultiAssetExchange
        inputAssets={inputAssets}
        outputAssets={outputAssets}
        spender={massetState?.address}
      />
    </div>
  );
};
