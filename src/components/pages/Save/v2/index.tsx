import React, { FC } from 'react';
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
import { Boost } from './Boost';
import { MassetModal } from './MassetModal';
import { SaveModal } from './SaveModal';
import { VaultModal } from './VaultModal';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useRewards } from './RewardsProvider';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { VaultROI } from './VaultROI';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 0 0 2px 2px;
  text-align: left;
  border-top: 1px solid ${({ theme }) => theme.color.accent};
  padding-top: 1rem;
`;

// TODO replace masset-specific names/icons
export const Save: FC = () => {
  const massetState = useSelectedMassetState();
  const vault = massetState?.savingsContracts?.v2?.boostedSavingsVault;

  const vaultBalance = vault?.account?.rawBalance ?? BigDecimal.ZERO;
  const massetToken = useTokenSubscription(massetState?.address);
  const saveToken = useTokenSubscription(
    massetState?.savingsContracts?.v2?.address,
  );
  const metaToken = useMetaToken();
  const vMetaToken = useTokenSubscription(vault?.stakingContract);

  const [showMassetModal] = useModalComponent({
    title: (
      <ModalTitle>
        <MUSDIcon />
        mUSD
      </ModalTitle>
    ),
    children: <MassetModal />,
  });
  const [showSaveModal] = useModalComponent({
    title: (
      <ModalTitle>
        <IMUSDIcon />
        imUSD
      </ModalTitle>
    ),
    children: <SaveModal />,
  });

  const [showVaultModal] = useModalComponent({
    title: (
      <ModalTitle>
        <IMUSDMTAIcon />
        imUSD Vault
      </ModalTitle>
    ),
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
      />
      <BalanceRow
        token={BalanceType.SavingsContractV2}
        apy={saveApy?.value}
        onClick={showSaveModal}
        balance={saveToken?.balance}
      />
      <BalanceRow
        token={BalanceType.BoostedSavingsVault}
        apy={saveApy?.value}
        highlight
        rewards={<VaultROI />}
        onClick={showVaultModal}
        balance={vaultBalance}
      >
        {(vaultBalance || hasRewards) && <Boost />}
      </BalanceRow>
      <BalanceRow token={BalanceType.Meta} balance={metaToken?.balance} />
      <BalanceRow
        token={BalanceType.VMeta}
        apy="Variable APY"
        balance={vMetaToken?.balance}
        onClick={navigateToGovernance}
        external
      />
    </Container>
  );
};
