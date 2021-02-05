import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer, Message } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { VaultWithdraw } from './VaultWithdraw';
import { VaultExit } from './VaultExit';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { ADDRESSES } from '../../../../constants';
import {
  formatMassetName,
  useSelectedMassetName,
} from '../../../../context/SelectedMassetNameProvider';

enum Tabs {
  Deposit = 'Deposit',
  DepositETH = 'DepositETH',
  Withdraw = 'Withdraw',
  Exit = 'Exit',
}

const { Deposit, DepositETH, Withdraw, Exit } = Tabs;

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

const tabTitles: { [key in Tabs]: string } = {
  [Deposit]: 'Deposit via Stablecoin',
  [DepositETH]: 'Deposit via ETH',
  [Withdraw]: 'Withdraw',
  [Exit]: 'Exit',
};

const tabInfo = (
  formattedMasset: string,
): { [key in Tabs]: string | undefined } => ({
  [Deposit]: `${`i${formattedMasset}`} will be minted from your selected stablecoin & deposited into the Vault. Your ${`i${formattedMasset}`} can be withdrawn at any time.`,
  [DepositETH]: `ETH will be traded via Uniswap V2 & Curve for ${formattedMasset}. Your ${formattedMasset} will then mint ${`i${formattedMasset}`} & be deposited into the Vault. Your ${`i${formattedMasset}`} can be withdrawn at any time.`,
  [Withdraw]: `Withdraw an amount of ${`i${formattedMasset}`} from the Vault, returning ${`i${formattedMasset}`} to your wallet.`,
  [Exit]: `Exiting the Vault will return your ${`i${formattedMasset}`}. You will no longer receive new MTA rewards but you will continue earning interest by holding ${`i${formattedMasset}`}.`,
});

export const VaultModal: FC = () => {
  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();
  const [tab, setTab] = useState<Tabs>(Tabs.Deposit);

  const canDepositWithWrapper =
    massetState?.savingsContracts.v2?.active && !!ADDRESSES.mUSD.SaveWrapper;

  const tabs = [
    Withdraw,
    Deposit,
    canDepositWithWrapper ? DepositETH : undefined,
    Exit,
  ];

  const formattedMassetName = formatMassetName(massetName);
  const tabInfoMessage = tabInfo(formattedMassetName)[tab];

  return (
    <Container>
      <TabsContainer>
        {tabs.map(
          t =>
            t && (
              <TabBtn active={tab === t} onClick={() => setTab(t)} key={t}>
                {tabTitles[t]}
              </TabBtn>
            ),
        )}
      </TabsContainer>
      {tabInfoMessage && (
        <Message>
          <span>{tabInfoMessage}</span>
        </Message>
      )}
      <div>
        {
          ({
            [Deposit]: <SaveDeposit saveAndStake />,
            [DepositETH]: <SaveDepositETH saveAndStake />,
            [Withdraw]: <VaultWithdraw />,
            [Exit]: <VaultExit />,
          } as { [key in Tabs]: JSX.Element })[tab]
        }
      </div>
    </Container>
  );
};
