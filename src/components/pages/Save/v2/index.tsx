import React, { FC } from 'react';
import styled from 'styled-components';
import { useToggle } from 'react-use';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import {
  useMetaToken,
  useTokenSubscription,
} from '../../../../context/TokensProvider';
import { useModalComponent } from '../../../../hooks/useModalComponent';

import { BalanceRow, BalanceType, BalanceHeader } from '../BalanceRow';
import { BoostCalculator } from '../../../rewards/BoostCalculator';
import { Boost } from '../../../rewards/Boost';
import { SaveModal } from './SaveModal';
import { VaultModal } from './VaultModal';
import { BigDecimal } from '../../../../web3/BigDecimal';
import {
  SavingsVaultRewardsProvider,
  useRewards,
} from './SavingsVaultRewardsProvider';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { VaultROI } from './VaultROI';
import { useSavePrices } from '../../../../hooks/usePrice';
import { Button } from '../../../core/Button';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { SaveModalHeader } from './SaveModalHeader';
import { VaultRewards } from './VaultRewards';

const GOVERNANCE_URL = 'https://governance.mstable.org/#/stake';

const PotentialBoost = styled.div`
  border-top: 1px solid ${({ theme }) => theme.color.accent};
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  > div {
    width: 100%;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.color.accent};
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0 0 2px 2px;
  text-align: left;

  > * {
    margin: 0.5rem 0;
  }
`;

export const Save: FC = () => {
  const [isCalculatorVisible, toggleCalculatorVisible] = useToggle(false);
  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();
  const isMBTC = massetName?.toLowerCase() === 'mbtc';
  const [mtaPrice, wbtcPrice] = useSavePrices() ?? [];

  const savingsContract = massetState?.savingsContracts?.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultBalance = vault?.account?.rawBalance;

  const exchangeRate = (isMBTC && wbtcPrice) || undefined;
  const imExchangeRate = isMBTC
    ? wbtcPrice * (savingsContract?.latestExchangeRate?.rate.simple ?? 0)
    : savingsContract?.latestExchangeRate?.rate.simple;

  const massetToken = useTokenSubscription(massetState?.address);
  const saveToken = useTokenSubscription(savingsContract?.address);
  const metaToken = useMetaToken();
  const vMetaToken = useTokenSubscription(vault?.stakingContract);

  const [showSaveModal] = useModalComponent({
    title: <SaveModalHeader masset={massetName} type="imasset" />,
    children: <SaveModal />,
  });
  const [showVaultModal] = useModalComponent({
    title: <SaveModalHeader masset={massetName} type="vault" />,
    children: <VaultModal />,
  });

  const saveApy = useAvailableSaveApy();
  const rewards = useRewards();

  const hasRewards = !!(rewards?.now.claimable || rewards?.now.vesting.locked);

  const navigateToGovernance = (): void => {
    window?.open(GOVERNANCE_URL);
  };

  return (
    <Container>
      <BalanceHeader />
      <BalanceRow
        token={BalanceType.Masset}
        balance={massetToken?.balance}
        dollarExchangeRate={exchangeRate}
        masset={massetName}
      />
      <BalanceRow
        token={BalanceType.Savings}
        apy={saveApy?.value}
        onClick={showSaveModal}
        balance={saveToken?.balance}
        dollarExchangeRate={imExchangeRate}
        masset={massetName}
      />
      {vault && (
        <>
          <div />
          <Divider />
          <div />
          <BalanceRow
            token={BalanceType.BoostedSavingsVault}
            apy={saveApy?.value}
            highlight
            rewards={<VaultROI />}
            onClick={showVaultModal}
            balance={vaultBalance ?? BigDecimal.ZERO}
            dollarExchangeRate={imExchangeRate}
            masset={massetName}
          >
            {vaultBalance || hasRewards ? (
              <Boost vault={vault} isImusd>
                <SavingsVaultRewardsProvider>
                  <VaultRewards />
                </SavingsVaultRewardsProvider>
              </Boost>
            ) : (
              <PotentialBoost>
                {isCalculatorVisible ? (
                  <BoostCalculator vault={vault} isImusd />
                ) : (
                  <Button scale={0.875} onClick={toggleCalculatorVisible}>
                    Calculate rewards
                  </Button>
                )}
              </PotentialBoost>
            )}
          </BalanceRow>
          <BalanceRow
            token={BalanceType.Meta}
            balance={metaToken?.balance}
            dollarExchangeRate={mtaPrice}
            masset={massetName}
          />
          <BalanceRow
            token={BalanceType.VMeta}
            balance={vMetaToken?.balance}
            onClick={navigateToGovernance}
            apy="Variable APY"
            external
            masset={massetName}
          />
        </>
      )}
    </Container>
  );
};
