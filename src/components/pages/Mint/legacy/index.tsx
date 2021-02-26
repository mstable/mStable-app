import React, { FC, useCallback } from 'react';
import { BigNumber } from 'ethers';
import Skeleton from 'react-loading-skeleton';

import { useSelectedLegacyMassetContract } from '../../../../web3/hooks';
import { useOwnAccount } from '../../../../context/UserProvider';
import { TransactionForm } from '../../../forms/TransactionForm';
import { Interfaces } from '../../../../types';
import { MintProvider, useMintState } from './MintProvider';
import { MintInput } from './MintInput';
import { MassetStats } from '../../../stats/MassetStats';
import { PageAction, PageHeader } from '../../PageHeader';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { MassetPage } from '../../MassetPage';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

const MintForm: FC = () => {
  const account = useOwnAccount();
  const {
    error,
    amountTouched,
    bAssets,
    mintAmount,
    massetState,
  } = useMintState();
  const contract = useSelectedLegacyMassetContract();
  const massetSymbol = massetState?.token.symbol;

  const createTransaction = useCallback(
    (
      formId: string,
    ): TransactionManifest<
      Interfaces.LegacyMasset,
      'mint' | 'mintMulti'
    > | void => {
      if (!error && contract && mintAmount.exact && account) {
        const enabled = Object.values(bAssets).filter(b => b.enabled);
        const body = `${mintAmount.format()} ${massetSymbol}`;
        const purpose = {
          present: `Minting ${body}`,
          past: `Minted ${body}`,
        };

        // Mint single for one asset
        if (enabled.length === 1 && enabled[0].amount?.exact) {
          return new TransactionManifest(
            contract,
            'mint',
            [enabled[0].address, enabled[0].amount.exact.toString()],
            purpose,
            formId,
          );
        }

        // Mint multi for more than one asset
        return new TransactionManifest(
          contract,
          'mintMulti',
          enabled.reduce(
            ([_addresses, _amounts, _receipient], b) => [
              [..._addresses, b.address],
              [..._amounts, b.amount?.exact as BigNumber],
              _receipient,
            ],
            [[] as string[], [] as BigNumber[], account],
          ),
          purpose,
          formId,
        );
      }
    },
    [account, bAssets, contract, error, massetSymbol, mintAmount],
  );

  return (
    <TransactionForm
      formId="mint"
      confirmLabel="Mint"
      createTransaction={createTransaction}
      input={<MintInput />}
      valid={amountTouched && !error}
    />
  );
};

export const Mint: FC = () => {
  const massetState = useSelectedMassetState();
  return massetState ? (
    <MintProvider>
      <PageHeader
        action={PageAction.Mint}
        subtitle="Convert stablecoins into mUSD"
      />
      <MassetPage>
        <MintForm />
      </MassetPage>
      <MassetStats />
    </MintProvider>
  ) : (
    <Skeleton height={400} />
  );
};
