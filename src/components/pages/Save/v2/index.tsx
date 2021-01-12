import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../../../core/Button';
import { useModalComponent } from '../../../../hooks/useModalComponent';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 0 0 2px 2px;
  text-align: left;

  > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 1rem;
    border: 1px #eee solid;
    padding: 1rem;
    > :last-child {
      display: flex;
      gap: 1rem;
    }
  }
`;

const SaveModal: FC = () => {
  return <div>SaveModal</div>;
};

const SaveAndStakeModal: FC = () => {
  return <div>SaveAndStakeModal</div>;
};

const SaveDepositModal: FC = () => {
  return <div>SaveDepositModal</div>;
};

const SaveWithdrawModal: FC = () => {
  return <div>SaveWithdrawModal</div>;
};

const SaveStakeModal: FC = () => {
  return <div>SaveStakeModal</div>;
};

const VaultWithdrawModal: FC = () => {
  return <div>VaultWithdrawModal</div>;
};

const VaultExitModal: FC = () => {
  return <div>VaultExitModal</div>;
};

export const Save: FC = () => {
  const [showSaveModal] = useModalComponent({
    title: 'Save mUSD',
    children: <SaveModal />,
  });
  const [showSaveAndStakeModal] = useModalComponent({
    title: 'Save and Stake mUSD',
    children: <SaveAndStakeModal />,
  });

  const [showSaveDepositModal] = useModalComponent({
    title: 'Deposit assets for imUSD',
    children: <SaveDepositModal />,
  });
  const [showSaveWithdrawModal] = useModalComponent({
    title: 'Withdraw imUSD',
    children: <SaveWithdrawModal />,
  });
  const [showSaveStakeModal] = useModalComponent({
    title: 'Stake imUSD',
    children: <SaveStakeModal />,
  });

  const [showVaultWithdrawModal] = useModalComponent({
    title: 'Withdraw Stake',
    children: <VaultWithdrawModal />,
  });
  const [showVaultExitModal] = useModalComponent({
    title: 'Exit Vault',
    children: <VaultExitModal />,
  });

  return (
    <Container>
      <div>
        <div>mUSD</div>
        <div>
          <Button onClick={showSaveModal}>Save</Button>
          <Button onClick={showSaveAndStakeModal}>Save & Stake</Button>
        </div>
      </div>
      <div>
        <div>imUSD</div>
        <div>
          <Button onClick={showSaveDepositModal}>Deposit</Button>
          <Button onClick={showSaveWithdrawModal}>Withdraw</Button>
          <Button onClick={showSaveStakeModal}>Stake</Button>
        </div>
      </div>
      <div>
        <div>imUSD Vault</div>
        <div>
          <Button onClick={showVaultWithdrawModal}>Withdraw</Button>
          <Button onClick={showVaultExitModal}>Exit</Button>
        </div>
      </div>
    </Container>
  );
};
