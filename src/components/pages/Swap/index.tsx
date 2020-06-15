import React, { FC, useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers/utils';
import { MusdStats } from '../../stats/MusdStats';

import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { SwapProvider, useSwapState } from './SwapProvider';
import { SwapInput } from './SwapInput';
import { SwapConfirm } from './SwapConfirm';
import { Interfaces } from '../../../types';
import { useMusdContract } from '../../../context/DataProvider/ContractsProvider';

const SwapForm: FC<{}> = () => {
  const { account } = useWallet();
  const {
    valid,
    values: { output, input },
    dataState,
  } = useSwapState();
  const setFormManifest = useSetFormManifest();
  const mUsdContract = useMusdContract();

  const { address: mAssetAddress } = dataState?.mAsset || {};

  const isMint = output.token.address && output.token.address === mAssetAddress;

  // Set the form manifest
  useEffect(() => {
    if (valid && account && mUsdContract) {
      if (isMint) {
        setFormManifest<Interfaces.Masset, 'mint'>({
          iface: mUsdContract,
          fn: 'mint',
          args: [
            input.token.address as string,
            input.amount.exact as BigNumber,
          ],
        });
        return;
      }

      setFormManifest<Interfaces.Masset, 'swap'>({
        iface: mUsdContract,
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
    mUsdContract,
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
      <SwapForm />
      <MusdStats />
    </FormProvider>
  </SwapProvider>
);
