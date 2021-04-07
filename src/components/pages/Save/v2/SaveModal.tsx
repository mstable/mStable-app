import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { TabSwitch } from '../../../core/Tabs';
import { InfoMessage } from '../../../core/InfoMessage';

import { SaveRedeem } from './SaveRedeem';
import { SaveDeposit } from './SaveDeposit';

enum Tabs {
  Deposit = 'Deposit',
  Redeem = 'Redeem',
}

const { Deposit, Redeem } = Tabs;

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
  [Deposit]: `Interest-bearing ${formattedMasset} (i${formattedMasset}) will be swapped with the selected asset. i${formattedMasset} can be redeemed for ${formattedMasset} at any time.`,
  [Redeem]: `Redeem an amount of i${formattedMasset} for ${formattedMasset}.`,
});

export const SaveModal: FC = () => {
  const massetState = useSelectedMassetState();

  const [activeTab, setActiveTab] = useState<string>(Tabs.Deposit as string);

  const tabs = {
    [Deposit]: {
      title: `Deposit`,
      component: <SaveDeposit />,
    },
    [Redeem]: {
      title: `Redeem`,
      component: <SaveRedeem />,
    },
  };

  const tabInfoMessage =
    massetState && tabInfo(massetState?.token.symbol)[activeTab as Tabs];

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
