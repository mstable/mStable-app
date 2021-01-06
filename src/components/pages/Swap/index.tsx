import React, { FC, useCallback } from 'react';
import { BigNumber } from 'ethers/utils';

import { MassetStats } from '../../stats/MassetStats';
import { TransactionManifest } from '../../../web3/TransactionManifest';
import { useOwnAccount } from '../../../context/UserProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { P } from '../../core/Typography';
import { SwapProvider, useSwapState } from './SwapProvider';
import { SwapInput } from './SwapInput';
import { SwapConfirm } from './SwapConfirm';
import { Interfaces } from '../../../types';
import { useSelectedMassetContract } from '../../../web3/hooks';
import { PageHeader } from '../PageHeader';

const SwapForm: FC = () => {
  const account = useOwnAccount();
  const {
    valid,
    values: { output, input },
    massetState,
  } = useSwapState();
  const contract = useSelectedMassetContract();

  const { address: mAssetAddress } = massetState || {};

  const isMint = output.token.address && output.token.address === mAssetAddress;

  // Set the form manifest
  const createTransaction = useCallback(
    (
      formId: string,
    ): TransactionManifest<Interfaces.Masset, 'mint' | 'swap'> | void => {
      if (valid && account && contract) {
        if (isMint) {
          const body = `${output.amount.simple} ${output.token.symbol} with ${input.token.symbol}`;
          return new TransactionManifest(
            contract,
            'mint',
            [input.token.address as string, input.amount.exact as BigNumber],
            {
              present: `Minting ${body}`,
              past: `Minted ${body}`,
            },
            formId,
          );
        }

        const body = `${input.amount.simple} ${input.token.symbol} for ${output.token.symbol}`;
        return new TransactionManifest(
          contract,
          'swap',
          [
            input.token.address as string,
            output.token.address as string,
            input.amount.exact as BigNumber,
            account,
          ],
          {
            present: `Swapping ${body}`,
            past: `Swapped ${body}`,
          },
          formId,
        );
      }
    },
    [
      account,
      contract,
      input.amount.exact,
      input.amount.simple,
      input.token.address,
      input.token.symbol,
      isMint,
      output.amount.simple,
      output.token.address,
      output.token.symbol,
      valid,
    ],
  );

  return (
    <TransactionForm
      formId="swap"
      confirm={<SwapConfirm />}
      confirmLabel="Swap"
      createTransaction={createTransaction}
      input={<SwapInput />}
      valid={valid}
    />
  );
};

export const Swap: FC = () => (
  <SwapProvider>
    <PageHeader title="Swap" subtitle="Exchange stablecoins with mStable">
      <P>mStable offers zero-slippage 1:1 stablecoin swaps.</P>
    </PageHeader>
    <SwapForm />
    <MassetStats />
  </SwapProvider>
);
