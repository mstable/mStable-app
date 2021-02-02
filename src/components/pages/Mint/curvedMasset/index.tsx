import { getUnixTime } from 'date-fns';
import { bigNumberify } from 'ethers/utils';
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
  const { invariantStartingCap, invariantStartTime } = massetState ?? {};

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
    if (!invariantStartingCap || !invariantStartTime) return;

    const currentTime = getUnixTime(Date.now());

    const weeksSinceLaunch = Math.floor(
      (currentTime - invariantStartTime) / 604800,
    );

    if (weeksSinceLaunch > 12) return;

    const maxK = invariantStartingCap.add(
      bigNumberify(weeksSinceLaunch)
        .mul((1e18).toString())
        .pow(2)
        .div((1e18).toString()),
    );

    return new BigDecimal(maxK);
  }, [invariantStartTime, invariantStartingCap]);

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
