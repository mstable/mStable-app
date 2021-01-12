import React, { FC } from 'react';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { BoostedSavingsVaultFactory } from '../../../../typechain/BoostedSavingsVaultFactory';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';

import { SendButton } from '../../../forms/SendButton';

const formId = 'VaultExit';

export const VaultExit: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;

  // TODO show stake balance and rewards

  // TODO validate the user has staked
  const valid = true;

  return (
    <div>
      <SendButton
        valid={valid}
        title="Exit"
        handleSend={() => {
          if (vaultAddress && signer) {
            // TODO provide tranches
            propose<Interfaces.BoostedSavingsVault, 'exit()'>(
              new TransactionManifest(
                BoostedSavingsVaultFactory.connect(vaultAddress, signer),
                'exit()',
                [],
                {
                  present: `Exiting the vault`,
                  past: `Exited the vault`,
                },
                formId,
              ),
            );
          }
        }}
      />
      <div>This will claim XXX rewards</div>
    </div>
  );
};
