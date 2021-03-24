import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabSwitch } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { VaultWithdraw } from './VaultWithdraw';
import { VaultExit } from './VaultExit';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { ADDRESSES } from '../../../../constants';
import { InfoMessage } from '../../../core/InfoMessage';

enum Tabs {
  Deposit = 'Deposit',
  DepositETH = 'DepositETH',
  Withdraw = 'Withdraw',
  Exit = 'Exit',
}

const { Deposit, DepositETH, Withdraw, Exit } = Tabs;

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
  [Deposit]: `i${formattedMasset} will be minted from your selected stablecoin & deposited into the Vault. Your i${formattedMasset} can be withdrawn at any time.`,
  [DepositETH]: `ETH will be traded via Uniswap V2 & Curve for ${formattedMasset}. Your ${formattedMasset} will then mint i${formattedMasset} & be deposited into the Vault. Your i${formattedMasset} can be withdrawn at any time.`,
  [Withdraw]: `Withdraw an amount of i${formattedMasset} from the Vault, returning i${formattedMasset} to your wallet.`,
  [Exit]: `Exiting the Vault will return your i${formattedMasset}. You will no longer receive new MTA rewards but you will continue earning interest by holding i${formattedMasset}.`,
});

export const VaultModal: FC = () => {
  const massetState = useSelectedMassetState();
  const massetSymbol = massetState?.token.symbol;
  const saveWrapperAddress =
    ADDRESSES[massetSymbol?.toLowerCase() as 'mbtc' | 'musd']?.SaveWrapper;
  const canDepositWithWrapper =
    massetState?.savingsContracts.v2?.active && !!saveWrapperAddress;

  const [activeTab, setActiveTab] = useState<string>(Deposit as string);
  const tabInfoMessage =
    massetSymbol && tabInfo(massetSymbol)[activeTab as Tabs];

  const tabs = {
    [Deposit]: {
      title: `Deposit`,
      component: <SaveDeposit saveAndStake />,
    },
    [DepositETH]: {
      title: 'Deposit via ETH',
      component:
        canDepositWithWrapper && massetSymbol === 'mUSD' ? (
          <SaveDepositETH saveAndStake />
        ) : undefined,
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
