import React, { FC } from 'react';
import styled from 'styled-components';

import { useModalComponent } from '../../../../hooks/useModalComponent';
import { BalanceRow, BalanceType, BalanceHeader } from '../BalanceRow';
import { Boost } from './Boost';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 0 0 2px 2px;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const IMUSDVaultModal: FC = () => {
  return <div>imUSD Vault here</div>;
};

const IMUSDModal: FC = () => {
  return <div>imUSD Modal here</div>;
};

const MUSDModal: FC = () => {
  return <div>mUSD Modal here</div>;
};

export const Save: FC = () => {
  const [showMUSDModal] = useModalComponent({
    title: 'mUSD',
    children: <MUSDModal />,
  });
  const [showIMUSDModal] = useModalComponent({
    title: 'imUSD',
    children: <IMUSDModal />,
  });

  const [showIMUSDVaultModal] = useModalComponent({
    title: 'imUSD Vault',
    children: <IMUSDVaultModal />,
  });

  return (
    <Container>
      <BalanceHeader />
      <BalanceRow token={BalanceType.MUSD} onClick={showMUSDModal} />
      <BalanceRow token={BalanceType.IMUSD} onClick={showIMUSDModal} />
      <BalanceRow token={BalanceType.IMUSD_VAULT} onClick={showIMUSDVaultModal}>
        <Boost />
      </BalanceRow>
    </Container>
  );
};
