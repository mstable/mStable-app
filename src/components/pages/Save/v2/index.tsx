import React, { FC } from 'react';
import styled from 'styled-components';

import { useModalComponent } from '../../../../hooks/useModalComponent';

import { ReactComponent as IMUSDMTAIcon } from '../../../icons/tokens/imusd-mta.svg';
import { ReactComponent as IMUSDIcon } from '../../../icons/tokens/imUSD.svg';
import { ReactComponent as MUSDIcon } from '../../../icons/tokens/mUSD.svg';
import { BalanceRow, BalanceType, BalanceHeader } from '../BalanceRow';
import { Boost } from './Boost';
import { MassetModal } from './MassetModal';
import { SaveModal } from './SaveModal';
import { VaultModal } from './VaultModal';

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
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

// TODO don't hardcode titles for masset

export const Save: FC = () => {
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

  return (
    <Container>
      <BalanceHeader />
      <BalanceRow token={BalanceType.MUSD} onClick={showMassetModal} />
      <BalanceRow token={BalanceType.IMUSD} onClick={showSaveModal} />
      <BalanceRow token={BalanceType.IMUSD_VAULT} onClick={showVaultModal}>
        <Boost />
      </BalanceRow>
    </Container>
  );
};
