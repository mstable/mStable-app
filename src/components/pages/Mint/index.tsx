import React, { FC, useEffect } from 'react';
import { BigNumber } from 'ethers/utils';

import { useSelectedMassetContract } from '../../../web3/hooks';
import { useOwnAccount } from '../../../context/UserProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { Interfaces } from '../../../types';
import { MintProvider, useMintState } from './MintProvider';
import { MintInput } from './MintInput';
import { MassetStats } from '../../stats/MassetStats';
import { PageHeader } from '../PageHeader';

const MintForm: FC = () => {
  const account = useOwnAccount();
  const {
    error,
    amountTouched,
    bAssets,
    mintAmount,
    massetState,
  } = useMintState();
  const setFormManifest = useSetFormManifest();
  const contract = useSelectedMassetContract();
  const massetSymbol = massetState?.token.symbol;

  // Set the form manifest
  useEffect(() => {
    if (!error && contract && mintAmount.exact && account) {
      const enabled = Object.values(bAssets).filter(b => b.enabled);
      const body = `${mintAmount.format()} ${massetSymbol}`;
      const purpose = {
        present: `Minting ${body}`,
        past: `Minted ${body}`,
      };

      // Mint single for one asset
      if (enabled.length === 1 && enabled[0].amount?.exact) {
        setFormManifest<Interfaces.Masset, 'mint'>({
          iface: contract,
          args: [enabled[0].address, enabled[0].amount.exact.toString()],
          fn: 'mint',
          purpose,
        });
        return;
      }

      // Mint multi for more than one asset
      setFormManifest<Interfaces.Masset, 'mintMulti'>({
        iface: contract,
        args: enabled.reduce(
          ([_addresses, _amounts, _receipient], b) => [
            [..._addresses, b.address],
            [..._amounts, b.amount?.exact as BigNumber],
            _receipient,
          ],
          [[] as string[], [] as BigNumber[], account],
        ),
        fn: 'mintMulti',
        purpose,
      });
      return;
    }

    setFormManifest(null);
  }, [
    account,
    bAssets,
    contract,
    error,
    massetSymbol,
    mintAmount,
    mintAmount.exact,
    setFormManifest,
  ]);

  return (
    <TransactionForm
      confirmLabel="Mint"
      input={<MintInput />}
      transactionsLabel="Mint transactions"
      valid={amountTouched && !error}
    />
  );
};

export const Mint: FC = () => (
  <MintProvider>
    <FormProvider formId="mint">
      <PageHeader title="Mint" subtitle="Convert stablecoins into mUSD" />
      <MintForm />
      <MassetStats />
    </FormProvider>
  </MintProvider>
);
