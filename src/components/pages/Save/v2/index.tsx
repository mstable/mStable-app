import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import {
  useMetaToken,
  useTokenSubscription,
} from '../../../../context/TokensProvider';
import { useModalComponent } from '../../../../hooks/useModalComponent';

import { ReactComponent as IMUSDMTAIcon } from '../../../icons/tokens/imusd-mta.svg';
import { ReactComponent as IMUSDIcon } from '../../../icons/tokens/imUSD.svg';
import { ReactComponent as MUSDIcon } from '../../../icons/tokens/mUSD.svg';

import { BalanceRow, BalanceType, BalanceHeader } from '../BalanceRow';
import { Boost, BoostCalculator } from './Boost';
import { SaveTabs, TabType } from './SaveTabs';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useRewards } from './RewardsProvider';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { VaultROI } from './VaultROI';
import { useMtaPrice } from '../../../../hooks/useMtaPrice';
import { Button } from '../../../core/Button';

const GOVERNANCE_URL = 'https://governance.mstable.org/';

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > svg {
    width: 2rem;
    height: auto;
  }
`;

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

// TODO replace masset-specific names/icons
export const Save: FC = () => {
  const [isCalculatorVisible, setCalculatorVisible] = useState(false);
  const massetState = useSelectedMassetState();
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
    title: (
      <ModalTitle>
        <MUSDIcon />
        mUSD
      </ModalTitle>
    ),
    children: <SaveTabs type={TabType.Masset} />,
  });

  const [showSaveModal] = useModalComponent({
    title: (
      <ModalTitle>
        <IMUSDIcon />
        imUSD
      </ModalTitle>
    ),
    children: <SaveTabs type={TabType.Save} />,
  });

  const [showVaultModal] = useModalComponent({
    title: (
      <ModalTitle>
        <IMUSDMTAIcon />
        imUSD Vault
      </ModalTitle>
    ),
    children: <SaveTabs type={TabType.Vault} defaultIndex={1} />,
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
      />
      <BalanceRow
        token={BalanceType.SavingsContractV2}
        apy={saveApy?.value}
        onClick={showSaveModal}
        balance={saveToken?.balance}
        dollarExchangeRate={exchangeRate}
      />
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
              <Button scale={0.875} onClick={() => setCalculatorVisible(true)}>
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
      />
      <BalanceRow
        token={BalanceType.VMeta}
        balance={vMetaToken?.balance}
        onClick={navigateToGovernance}
        apy="Variable APY"
        external
      />
    </Container>
  );
};
