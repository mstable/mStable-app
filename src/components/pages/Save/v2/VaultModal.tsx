import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { InfoMessage } from '../../../core/InfoMessage';
import { TabSwitch } from '../../../core/Tabs';

import { SaveDeposit } from './SaveDeposit';
import { VaultWithdraw } from './VaultWithdraw';
import { VaultExit } from './VaultExit';

enum Tabs {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Exit = 'Exit',
}

const { Deposit, Withdraw, Exit } = Tabs;

const Container = styled.div`
  > div:last-child {
    padding: 1rem;

    > div:first-child {
      margin-bottom: 1rem;
    }
  }
`;

const tabInfo = (
  formattedMasset: string,
): { [key in Tabs]: string | undefined } => ({
  [Deposit]: `Interest-bearing ${formattedMasset} (i${formattedMasset}) will be swapped with the selected asset and deposited in the Vault. i${formattedMasset} can be redeemed for ${formattedMasset} at any time.`,
  [Withdraw]: `Withdraw an amount of i${formattedMasset} from the Vault, returning i${formattedMasset} to your wallet.`,
  [Exit]: `Exiting the Vault will return your i${formattedMasset}. You will no longer receive new MTA rewards but you will continue earning interest by holding i${formattedMasset}.`,
});

export const VaultModal: FC = () => {
  const massetState = useSelectedMassetState();

  const [activeTab, setActiveTab] = useState<string>(Deposit as string);
  const tabInfoMessage =
    massetState && tabInfo(massetState.token.symbol)[activeTab as Tabs];

  const tabs = {
    [Deposit]: {
      title: `Deposit`,
      component: <SaveDeposit saveAndStake />,
    },
    [Withdraw]: {
      title: `Withdraw`,
      component: <VaultWithdraw />,
    },
    [Exit]: {
      title: `Exit`,
      component: <VaultExit />,
    },
  };

  return (
    <Container>
      <TabSwitch tabs={tabs} active={activeTab} onClick={setActiveTab}>
        {tabInfoMessage && (
          <InfoMessage>
            <span>{tabInfoMessage}</span>
          </InfoMessage>
        )}
      </TabSwitch>
    </Container>
  );
};
