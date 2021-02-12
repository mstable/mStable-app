import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer, Message } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { SaveRedeem } from './SaveRedeem';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { ADDRESSES } from '../../../../constants';

enum Tabs {
  DepositStablecoins,
  DepositETH,
  Redeem,
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
  [DepositStablecoins]: `Interest-bearing ${formattedMasset} (${`i${formattedMasset}`}) will be minted from your selected stablecoin. Your ${`i${formattedMasset}`} can be redeemed for ${formattedMasset} at any time.`,
  [DepositETH]: `ETH will be automatically traded via Uniswap V2 & Curve for ${formattedMasset}. Your ${formattedMasset} will then be deposited for ${`i${formattedMasset}`} (interest-bearing ${formattedMasset}). Your ${`i${formattedMasset}`} can be redeemed for ${formattedMasset} at any time.`,
  [Redeem]: `Redeem an amount of ${`i${formattedMasset}`} for ${formattedMasset}.`,
});

// TODO TabbedModal
export const SaveModal: FC = () => {
  const massetState = useSelectedMassetState();
  const massetSymbol = massetState?.token.symbol;
  const isActive = massetState?.savingsContracts.v2?.active;
  const saveWrapperAddress =
    ADDRESSES[massetSymbol as 'mbtc' | 'musd']?.SaveWrapper;

  const [tab, setTab] = useState<Tabs>(Tabs.DepositStablecoins);

  const tabInfoMessage = massetSymbol && tabInfo(massetSymbol)[tab];

  const [tabs, ActiveComponent] = useMemo(() => {
    const _tabs = [
      {
        tab: Tabs.DepositStablecoins,
        label: `Deposit via ${massetSymbol === 'mUSD' ? 'Stablecoin' : 'mBTC'}`,
        component: SaveDeposit,
        active: tab === Tabs.DepositStablecoins,
      },
      ...(isActive && saveWrapperAddress
        ? [
            {
              tab: Tabs.DepositETH,
              label: 'Deposit via ETH',
              component: SaveDepositETH,
              active: tab === Tabs.DepositETH,
            },
          ]
        : []),
      {
        tab: Tabs.Redeem,
        label: `Redeem ${massetSymbol}`,
        component: SaveRedeem,
        active: tab === Tabs.Redeem,
      },
    ];
    const activeComponent = _tabs.find(t => t.active)?.component as FC;
    return [_tabs, activeComponent];
  }, [tab, isActive, saveWrapperAddress, massetSymbol]);

  return (
    <Container>
      <TabsContainer>
        {tabs.map(_tab => (
          <TabBtn
            key={_tab.tab.toString()}
            active={_tab.active}
            onClick={() => {
              setTab(_tab.tab);
            }}
          >
            {_tab.label}
          </TabBtn>
        ))}
      </TabsContainer>
      {tabInfoMessage && (
        <Message>
          <span>{tabInfoMessage}</span>
        </Message>
      )}
      {ActiveComponent && <ActiveComponent />}
    </Container>
  );
};
