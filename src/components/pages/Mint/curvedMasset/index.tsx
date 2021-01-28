import React, { FC, useMemo } from 'react';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MultiAssetExchange } from '../../../forms/MultiAssetExchange';
import {
  CurvedMintProvider,
  useMintState,
} from './provider/CurvedMintProvider';

const MintForm: FC = () => {
  const massetState = useSelectedMassetState();
  const mintState = useMintState();

  const inputAssets = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(massetState?.bAssets ?? {}).map(
          ([
            address,
            {
              token: { decimals, balance },
            },
          ]) => [address, { decimals, balance }],
        ),
      ),
    [massetState],
  );

  const outputAssets = useMemo(() => {
    if (!massetState) return {};
    const { address, decimals } = massetState.token;
    return { [address]: { decimals } };
  }, [massetState]);

  return (
    <div>
      <MultiAssetExchange
        inputAssets={inputAssets}
        outputAssets={outputAssets}
        spender={mintState.massetState?.address}
      />
    </div>
  );
};

export const Mint: FC = () => (
  <CurvedMintProvider>
    <MintForm />
  </CurvedMintProvider>
);
