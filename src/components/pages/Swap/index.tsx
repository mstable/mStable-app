import React, { FC, useEffect } from 'react';
import { BigNumber } from 'ethers/utils';
import { MassetStats } from '../../stats/MassetStats';

import { useOwnAccount } from '../../../context/UserProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
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
  const setFormManifest = useSetFormManifest();
  const contract = useSelectedMassetContract();

  const { address: mAssetAddress } = massetState || {};

  const isMint = output.token.address && output.token.address === mAssetAddress;

  // Set the form manifest
  useEffect(() => {
    if (valid && account && contract) {
      if (isMint) {
        const body = `${output.amount.simple} ${output.token.symbol} with ${input.token.symbol}`;
        setFormManifest<Interfaces.Masset, 'mint'>({
          iface: contract,
          fn: 'mint',
          args: [
            input.token.address as string,
            input.amount.exact as BigNumber,
          ],
          purpose: {
            present: `Minting ${body}`,
            past: `Minted ${body}`,
          },
        });
        return;
      }

      const body = `${input.amount.simple} ${input.token.symbol} for ${output.token.symbol}`;
      setFormManifest<Interfaces.Masset, 'swap'>({
        iface: contract,
        fn: 'swap',
        args: [
          input.token.address as string,
          output.token.address as string,
          input.amount.exact as BigNumber,
          account,
        ],
        purpose: {
          present: `Swapping ${body}`,
          past: `Swapped ${body}`,
        },
      });
      return;
    }

    setFormManifest(null);
  }, [
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
    setFormManifest,
    valid,
  ]);

  return (
    <TransactionForm
      confirm={<SwapConfirm />}
      confirmLabel="Swap"
      input={<SwapInput />}
      transactionsLabel="Swap transactions"
      valid={valid}
    />
  );
};

export const Swap: FC = () => (
  <SwapProvider>
    <FormProvider formId="swap">
      <PageHeader title="Swap" subtitle="Exchange stablecoins with mStable">
        <P>mStable offers zero-slippage 1:1 stablecoin swaps.</P>
      </PageHeader>
      <SwapForm />
      <MassetStats />
    </FormProvider>
  </SwapProvider>
);
