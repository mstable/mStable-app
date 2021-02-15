import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import {
  useMetaToken,
  useTokenSubscription,
} from '../../../../context/TokensProvider';
import { useModalComponent } from '../../../../hooks/useModalComponent';

import { BalanceRow, BalanceType, BalanceHeader } from '../BalanceRow';
import { Boost, BoostCalculator } from './Boost';
import { MassetModal } from './MassetModal';
import { SaveModal } from './SaveModal';
import { VaultModal } from './VaultModal';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useRewards } from './RewardsProvider';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { VaultROI } from './VaultROI';
import { useMtaPrice } from '../../../../hooks/useMtaPrice';
import { Button } from '../../../core/Button';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { SaveModalHeader } from './SaveModalHeader';

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
  border-top: 1px solid ${({ theme }) => theme.color.accent};
  padding-top: 1rem;

  > * {
    margin: 0.5rem 0;
  }
`;

export const Save: FC = () => {
  const [isCalculatorVisible, setCalculatorVisible] = useState(false);
  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();
  const mtaPrice = useMtaPrice();

  const savingsContract = massetState?.savingsContracts?.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultBalance = vault?.account?.rawBalance;
  const exchangeRate = savingsContract?.latestExchangeRate?.rate.simple;

  const massetToken = useTokenSubscription(massetState?.address);
  const saveToken = useTokenSubscription(savingsContract?.address);
  const metaToken = useMetaToken();
  const vMetaToken = useTokenSubscription(vault?.stakingContract);

  const [showMassetModal] = useModalComponent({
    title: <SaveModalHeader masset={massetName} type="masset" />,
    children: <MassetModal />,
  });
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
        onClick={showMassetModal}
        balance={massetToken?.balance}
        masset={massetName}
      />
      <BalanceRow
        token={BalanceType.Savings}
        apy={saveApy?.value}
        onClick={showSaveModal}
        balance={saveToken?.balance}
        dollarExchangeRate={exchangeRate}
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
            dollarExchangeRate={exchangeRate}
            masset={massetName}
          >
            {vaultBalance || hasRewards ? (
              <Boost />
            ) : (
              <PotentialBoost>
                {isCalculatorVisible ? (
                  <BoostCalculator
                    onBackClick={() => setCalculatorVisible(false)}
                  />
                ) : (
                  <Button
                    scale={0.875}
                    onClick={() => setCalculatorVisible(true)}
                  >
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
