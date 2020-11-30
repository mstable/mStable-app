import React, { FC, useEffect } from 'react';
import { BigNumber } from 'ethers/utils';
import { MassetStats } from '../../stats/MassetStats';

import { useOwnAccount } from '../../../context/UserProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { ReactComponent as SwapIcon } from '../../icons/circle/swap.svg';
import { P } from '../../core/Typography';
import { SwapProvider, useSwapState } from './SwapProvider';
import { SwapInput } from './SwapInput';
import { SwapConfirm } from './SwapConfirm';
import { Interfaces } from '../../../types';
import { useSelectedMassetContract } from '../../../context/DataProvider/ContractsProvider';
import { PageHeader } from '../PageHeader';

const SwapForm: FC<{}> = () => {
  const account = useOwnAccount();
  const {
    valid,
    values: { output, input },
    dataState,
  } = useSwapState();
  const setFormManifest = useSetFormManifest();
  const contract = useSelectedMassetContract();

  const { address: mAssetAddress } = dataState?.mAsset || {};

  const isMint = output.token.address && output.token.address === mAssetAddress;

  // Set the form manifest
  useEffect(() => {
    if (valid && account && contract) {
      if (isMint) {
        setFormManifest<Interfaces.Masset, 'mint'>({
          iface: contract,
          fn: 'mint',
          args: [
            input.token.address as string,
            input.amount.exact as BigNumber,
          ],
        });
        return;
      }

      setFormManifest<Interfaces.Masset, 'swap'>({
        iface: contract,
        fn: 'swap',
        args: [
          input.token.address as string,
          output.token.address as string,
          input.amount.exact as BigNumber,
          account,
        ],
      });
      return;
    }

    setFormManifest(null);
  }, [
    account,
    input.amount.exact,
    input.token.address,
    isMint,
    contract,
    output.token.address,
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

export const Swap: FC<{}> = () => (
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
