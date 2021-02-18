import React, { FC } from 'react';
import styled from 'styled-components';

import { Step } from './types';
import { useRenMintStep } from './RenMintProvider';
import { RenMintInitiate as InitiateStep } from './RenMintInitiate';
import { RenMintDeposit as DepositStep } from './RenMintDeposit';
import { RenMintPending as PendingStep } from './RenMintPending';
import { RenMintConfirm as ConfirmStep } from './RenMintConfirm';

const { Initiate, Deposit, Pending, Confirm, Complete } = Step;

const Header = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.color.accent};
  width: 100%;
  margin-bottom: 1.5rem;
`;

const Container = styled.div`
  border: ${({ theme }) => `1px solid ${theme.color.accent}`};
  border-radius: 1rem;
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;

  > *:not(:last-child):not(:first-child) {
    margin-bottom: 2rem;
  }
`;

const StepContent: Record<Step, JSX.Element> = {
  [Initiate]: <InitiateStep />,
  [Deposit]: <DepositStep />,
  [Pending]: <PendingStep />,
  [Confirm]: <ConfirmStep />,
  [Complete]: <p>Complete</p>,
};

const getStepTitle: Record<Step, string> = {
  [Initiate]: 'Initiate Transaction',
  [Deposit]: 'Deposit BTC',
  [Pending]: 'Pending Confirmation',
  [Confirm]: 'Confirm Transaction',
  [Complete]: 'Transaction Confirmed',
};

export const RenMintOnboard: FC = () => {
  const [step, _] = useRenMintStep();
  const stepTitle = getStepTitle[step as Step];

  return (
    <Container>
      <Header>
        <h2>{stepTitle}</h2>
      </Header>
      {StepContent[step as Step]}
    </Container>
  );
};
