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
import { RedeemProvider, useRedeemState } from './RedeemProvider';
import { Mode } from './types';

const RedeemForm: FC<{}> = () => {
  const { account } = useWallet();
  const mUsdContract = useMusdContract();
  const setFormManifest = useSetFormManifest();
  const { redemption, valid, mode, bAssetOutputs } = useRedeemState();
  const enabled = bAssetOutputs.filter(b => b.enabled)[0];

  useEffect(() => {
    if (valid && account && mUsdContract && redemption.amount.exact) {
      if (mode === Mode.RedeemMasset) {
        setFormManifest<Interfaces.Masset, 'redeemMasset'>({
          iface: mUsdContract,
          args: [redemption.amount.exact, account],
          fn: 'redeemMasset',
        });
        return;
      }

      if (mode === Mode.RedeemSingle && enabled?.amount.exact) {
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
    redemption.amount.exact,
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

export const Redeem: FC<{}> = () => (
  <RedeemProvider>
    <FormProvider formId="redeem">
      <RedeemForm />
      <MusdStats />
    </FormProvider>
  </RedeemProvider>
);
