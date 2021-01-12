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

const SaveModal: FC = () => {
  return <div>SaveModal</div>;
};

const SaveAndStakeModal: FC = () => {
  return <div>SaveAndStakeModal</div>;
};

const SaveDepositModal: FC = () => {
  return <div>SaveDepositModal</div>;
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

  // const [showSaveWithdrawModal] = useModalComponent({
  //   title: 'Withdraw imUSD',
  //   children: <SaveWithdrawModal />,
  // });

  // const [showSaveStakeModal] = useModalComponent({
  //   title: 'Stake imUSD',
  //   children: <SaveStakeModal />,
  // });

  // const [showVaultWithdrawModal] = useModalComponent({
  //   title: 'Withdraw Stake',
  //   children: <VaultWithdrawModal />,
  // });
  // const [showVaultExitModal] = useModalComponent({
  //   title: 'Exit Vault',
  //   children: <VaultExitModal />,
  // });

  return (
    <Container>
      <BalanceHeader />
      <BalanceRow token={BalanceType.MUSD} onClick={showSaveModal} />
      <BalanceRow token={BalanceType.IMUSD} onClick={showSaveAndStakeModal} />
      <BalanceRow
        token={BalanceType.IMUSD_VAULT}
        onClick={showSaveDepositModal}
      >
        <Boost />
      </BalanceRow>
    </Container>
  );
};
