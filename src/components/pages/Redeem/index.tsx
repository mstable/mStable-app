import React, { FC, useEffect } from 'react';
import { useWallet } from 'use-wallet';

import { useMusdContract } from '../../../context/DataProvider/ContractsProvider';
import { Interfaces } from '../../../types';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { MusdStats } from '../../stats/MusdStats';
import { RedeemInput } from './RedeemInput';
import { RedeemConfirm } from './RedeemConfirm';
import {
  RedeemProvider,
  useRedeemSimulation,
  useRedeemState,
} from './RedeemProvider';
import { Mode } from './types';

const RedeemForm: FC<{}> = () => {
  const { account } = useWallet();
  const mUsdContract = useMusdContract();
  const setFormManifest = useSetFormManifest();
  const { amountInMasset, valid, mode, bAssets } = useRedeemState();
  const enabled = Object.values(bAssets).filter(b => b.enabled)[0];

  useEffect(() => {
    if (valid && account && mUsdContract && amountInMasset) {
      if (mode === Mode.RedeemMasset) {
        setFormManifest<Interfaces.Masset, 'redeemMasset'>({
          iface: mUsdContract,
          args: [amountInMasset.exact, account],
          fn: 'redeemMasset',
        });
        return;
      }

      if (mode === Mode.RedeemSingle && enabled?.amount) {
        setFormManifest<Interfaces.Masset, 'redeem'>({
          iface: mUsdContract,
          args: [enabled.address, enabled.amount.exact],
          fn: 'redeem',
        });
        return;
      }
    }

    setFormManifest(null);
  }, [
    account,
    enabled,
    mUsdContract,
    mode,
    amountInMasset,
    setFormManifest,
    valid,
  ]);

  return (
    <TransactionForm
      confirm={<RedeemConfirm />}
      confirmLabel="Redeem"
      input={<RedeemInput />}
      transactionsLabel="Redeem transactions"
      valid={valid}
    />
  );
};

const RedeemStats: FC<{}> = () => {
  const simulation = useRedeemSimulation(true);
  return <MusdStats simulation={simulation} />;
};

export const Redeem: FC<{}> = () => (
  <RedeemProvider>
    <FormProvider formId="redeem">
      <RedeemForm />
      <RedeemStats />
    </FormProvider>
  </RedeemProvider>
);
