import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabSwitch, Message } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { SaveRedeem } from './SaveRedeem';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { ADDRESSES } from '../../../../constants';
import { SaveDepositAMM } from './SaveDepositAMM';

enum Tabs {
  DepositStablecoins = 'DepositStablecoins',
  DepositETH = 'DepositETH',
  Redeem = 'Redeem',
}

const { DepositStablecoins, DepositETH, Redeem } = Tabs;

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

const tabInfo = (
  formattedMasset: string,
): { [key in Tabs]: string | undefined } => ({
  [DepositStablecoins]: `Interest-bearing ${formattedMasset} (i${formattedMasset}) will be minted from your selected stablecoin. Your i${formattedMasset} can be redeemed for ${formattedMasset} at any time.`,
  [DepositETH]: `ETH will be automatically traded via Uniswap V2 & Curve for ${formattedMasset}. Your ${formattedMasset} will then be deposited for i${formattedMasset} (interest-bearing ${formattedMasset}). Your i${formattedMasset} can be redeemed for ${formattedMasset} at any time.`,
  [Redeem]: `Redeem an amount of i${formattedMasset} for ${formattedMasset}.`,
});

export const SaveModal: FC = () => {
  const massetState = useSelectedMassetState();
  const massetSymbol = massetState?.token.symbol;
  const saveWrapperAddress =
    ADDRESSES[massetSymbol?.toLowerCase() as 'mbtc' | 'musd']?.SaveWrapper;
  const canDepositWithWrapper =
    massetState?.savingsContracts.v2?.active && !!saveWrapperAddress;

  const [activeTab, setActiveTab] = useState<string>(
    Tabs.DepositStablecoins as string,
  );

  const tabs = {
    [DepositStablecoins]: {
      title: `Deposit`,
      component: massetSymbol === 'mUSD' ? <SaveDeposit /> : <SaveDepositAMM />,
    },
    [DepositETH]: {
      title: 'Deposit via ETH',
      component:
        canDepositWithWrapper && massetSymbol === 'mUSD' ? (
          <SaveDepositETH />
        ) : undefined,
    },
    [Redeem]: {
      title: `Redeem`,
      component: <SaveRedeem />,
    },
  };

  const tabInfoMessage =
    massetSymbol && tabInfo(massetSymbol)[activeTab as Tabs];

  return (
    <Container>
      <TabSwitch tabs={tabs} active={activeTab} onClick={setActiveTab}>
        {tabInfoMessage && (
          <Message>
            <span>{tabInfoMessage}</span>
          </Message>
        )}
      </TabSwitch>
    </Container>
  );
};
