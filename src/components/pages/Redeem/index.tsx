import React, { FC, useEffect } from 'react';

import { useSelectedMassetContract } from '../../../context/DataProvider/ContractsProvider';
import { useOwnAccount } from '../../../context/UserProvider';
import { Interfaces } from '../../../types';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { PageHeader } from '../PageHeader';
import { RedeemInput } from './RedeemInput';
import { RedeemConfirm } from './RedeemConfirm';
import { RedeemProvider, useRedeemState } from './RedeemProvider';
import { Mode } from './types';
import { BigDecimal } from '../../../web3/BigDecimal';

const RedeemForm: FC<{}> = () => {
  const account = useOwnAccount();
  const contract = useSelectedMassetContract();
  const setFormManifest = useSetFormManifest();
  const { amountInMasset, valid, mode, bAssets } = useRedeemState();
  const enabled = Object.values(bAssets).filter(b => b.enabled);

  useEffect(() => {
    if (valid && account && contract && amountInMasset) {
      if (mode === Mode.RedeemMasset) {
        setFormManifest<Interfaces.Masset, 'redeemMasset'>({
          iface: contract,
          args: [amountInMasset.exact, account],
          fn: 'redeemMasset',
        });
        return;
      }

      if (mode === Mode.RedeemMulti) {
        const addresses = enabled.map(b => b.address);
        const amounts = enabled.map(b => (b.amount as BigDecimal).exact);
        setFormManifest<Interfaces.Masset, 'redeemMulti'>({
          iface: contract,
          args: [addresses, amounts, account],
          fn: 'redeemMulti',
        });
        return;
      }

      if (mode === Mode.RedeemSingle && enabled[0]?.amount) {
        const { address, amount } = enabled[0];
        setFormManifest<Interfaces.Masset, 'redeem'>({
          iface: contract,
          args: [address, amount.exact],
          fn: 'redeem',
        });
        return;
      }
    }

    setFormManifest(null);
  }, [
    account,
    enabled,
    contract,
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

export const Redeem: FC<{}> = () => (
  <RedeemProvider>
    <FormProvider formId="redeem">
      <PageHeader
        title="Redeem"
        subtitle="Exchange mUSD for its underlying collateral"
      />
      <RedeemForm />
    </FormProvider>
  </RedeemProvider>
);
