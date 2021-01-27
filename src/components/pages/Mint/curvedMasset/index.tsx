import React, { FC } from 'react';
import { MultiAssetExchange } from '../../../forms/MultiAssetExchange';
import {
  CurvedMintProvider,
  useMintSetBassetAmount,
  useMintSetBassetMaxAmount,
  useMintState,
} from './provider/CurvedMintProvider';

const MintForm: FC = () => {
  const mintState = useMintState();
  const setBassetAmount = useMintSetBassetAmount();
  const setBassetMaxAmount = useMintSetBassetMaxAmount();
  const inputAssets = Object.values(mintState?.inputAssets ?? {});
  const outputAssets = Object.values(mintState?.outputAssets ?? {});

  return (
    <div>
      <MultiAssetExchange
        inputAssets={inputAssets}
        outputAssets={outputAssets}
        onAmountChange={setBassetAmount}
        onMaxAmountClick={setBassetMaxAmount}
      />
    </div>
  );
};

export const Mint: FC = () => (
  <CurvedMintProvider>
    <MintForm />
  </CurvedMintProvider>
);
