import React, { FC, useMemo } from 'react';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MultiAssetExchange } from '../../../forms/MultiAssetExchange';

export const Mint: FC = () => {
  const massetState = useSelectedMassetState();

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
