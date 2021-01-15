import React, { FC, useCallback } from 'react';

import { useSelectedMassetContract } from '../../../web3/hooks';
import { useOwnAccount } from '../../../context/UserProvider';
import { Interfaces } from '../../../types';
import { TransactionForm } from '../../forms/TransactionForm';
import { PageAction, PageHeader } from '../PageHeader';
import { RedeemInput } from './RedeemInput';
import { RedeemConfirm } from './RedeemConfirm';
import { RedeemProvider, useRedeemState } from './RedeemProvider';
import { Mode } from './types';
import { BigDecimal } from '../../../web3/BigDecimal';
import { TransactionManifest } from '../../../web3/TransactionManifest';

const RedeemForm: FC = () => {
  const account = useOwnAccount();
  const contract = useSelectedMassetContract();
  const {
    amountInMasset,
    valid,
    mode,
    bAssets,
    massetState,
  } = useRedeemState();
  const enabled = Object.values(bAssets).filter(b => b.enabled);
  const massetSymbol = massetState?.token.symbol;

  const createTransaction = useCallback(
    (
      formId: string,
    ): TransactionManifest<
      Interfaces.Masset,
      'redeemMasset' | 'redeemMulti' | 'redeem'
    > | void => {
      if (valid && account && contract && amountInMasset) {
        const body = `${amountInMasset.format()} ${massetSymbol}`;
        const purpose = {
          present: `Redeeming ${body}`,
          past: `Redeemed ${body}`,
        };

        if (mode === Mode.RedeemMasset) {
          return new TransactionManifest(
            contract,
            'redeemMasset',
            [amountInMasset.exact, account],
            purpose,
            formId,
          );
        }

        if (mode === Mode.RedeemMulti) {
          const addresses = enabled.map(b => b.address);
          const amounts = enabled.map(b => (b.amount as BigDecimal).exact);
          return new TransactionManifest(
            contract,
            'redeemMulti',
            [addresses, amounts, account],
            purpose,
            formId,
          );
        }

        if (mode === Mode.RedeemSingle && enabled[0]?.amount) {
          const { address, amount } = enabled[0];
          return new TransactionManifest(
            contract,
            'redeem',
            [address, amount.exact],
            purpose,
            formId,
          );
        }
      }
    },
    [account, amountInMasset, contract, enabled, massetSymbol, mode, valid],
  );

  return (
    <TransactionForm
      formId="redeem"
      confirm={<RedeemConfirm />}
      confirmLabel="Redeem"
      createTransaction={createTransaction}
      input={<RedeemInput />}
      valid={valid}
    />
  );
};

export const Redeem: FC = () => (
  <RedeemProvider>
    <PageHeader
      action={PageAction.Redeem}
      subtitle="Exchange mUSD for its underlying collateral"
    />
    <RedeemForm />
  </RedeemProvider>
);
