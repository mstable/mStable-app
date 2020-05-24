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

const RedeemForm: FC<{}> = () => {
  const { account } = useWallet();
  const mUsdContract = useMusdContract();
  const setFormManifest = useSetFormManifest();
  const { redemption, valid } = useRedeemState();

  useEffect(() => {
    if (valid && account && mUsdContract && redemption.amount.exact) {
      setFormManifest<Interfaces.Masset, 'redeemMasset'>({
        iface: mUsdContract,
        args: [redemption.amount.exact, account],
        fn: 'redeemMasset',
      });
      return;
    }

    setFormManifest(null);
  }, [account, mUsdContract, redemption.amount.exact, setFormManifest, valid]);

  return (
    <TransactionForm
      confirm={<RedeemConfirm />}
      confirmLabel="Redeem"
      formId="redeem"
      input={<RedeemInput />}
      transactionsLabel="Redeem transactions"
      valid={valid}
    />
  );
};

export const Redeem: FC<{}> = () => (
    <RedeemProvider>
      <FormProvider>
        <RedeemForm />
        <MusdStats />
      </FormProvider>
    </RedeemProvider>
  );
