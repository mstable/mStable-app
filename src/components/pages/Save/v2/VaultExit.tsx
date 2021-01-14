import React, { FC } from 'react';
import styled from 'styled-components';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { BoostedSavingsVaultFactory } from '../../../../typechain/BoostedSavingsVaultFactory';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';

import { SendButton } from '../../../forms/SendButton';
import { AssetOutputWidget } from '../../../forms/AssetOutputWidget';

const formId = 'VaultExit';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const VaultExit: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const saveAddress = savingsContract?.address;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;
  const rawBalance = vault?.account?.rawBalance;

  const valid = !!rawBalance?.exact.gt(0);

  return (
    <Container>
      <AssetOutputWidget
        title="Receive"
        outputAddress={saveAddress}
        inputAmount={rawBalance}
      />
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
      <div>{valid && 'Any available MTA rewards will be claimed.'}</div>
    </Container>
  );
};
