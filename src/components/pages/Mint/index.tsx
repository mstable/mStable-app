import React, { FC, useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers/utils';

import { useMusdContract } from '../../../context/DataProvider/ContractsProvider';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { Interfaces } from '../../../types';
import { MintProvider, useMintState } from './MintProvider';
import { MintInput } from './MintInput';
import { MusdStats } from '../../stats/MusdStats';

const MintForm: FC<{}> = () => {
  const { account } = useWallet();
  const { error, touched, bAssetInputs, mintAmount } = useMintState();
  const setFormManifest = useSetFormManifest();
  const mUsdContract = useMusdContract();

  // Set the form manifest
  useEffect(() => {
    if (!error && mUsdContract && mintAmount.exact && account) {
      const enabled = bAssetInputs.filter(b => b.enabled);

      // Mint single for one asset
      if (enabled.length === 1 && enabled[0].amount.exact) {
        setFormManifest<Interfaces.Masset, 'mint'>({
          iface: mUsdContract,
          args: [enabled[0].address, enabled[0].amount.exact.toString()],
          fn: 'mint',
        });
        return;
      }

      // Mint multi for more than one asset
      setFormManifest<Interfaces.Masset, 'mintMulti'>({
        iface: mUsdContract,
        args: enabled.reduce(
          ([_addresses, _amounts, _receipient], b) => [
            [..._addresses, b.address],
            [..._amounts, b.amount.exact as BigNumber],
            _receipient,
          ],
          [[] as string[], [] as BigNumber[], account],
        ),
        fn: 'mintMulti',
      });
      return;
    }

    setFormManifest(null);
  }, [
    account,
    bAssetInputs,
    error,
    mintAmount.exact,
    mUsdContract,
    setFormManifest,
  ]);

  return (
    <TransactionForm
      confirmLabel="Mint"
      input={<MintInput />}
      transactionsLabel="Mint transactions"
      valid={touched && !error}
    />
  );
};

export const Mint: FC<{}> = () => (
  <MintProvider>
    <FormProvider formId="mint">
      <MintForm />
      <MusdStats />
    </FormProvider>
  </MintProvider>
);
