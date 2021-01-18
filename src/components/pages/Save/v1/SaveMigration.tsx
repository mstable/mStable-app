import React, { FC } from 'react';
import styled from 'styled-components';
import { useToggle } from 'react-use';

import { useTransactionsState } from '../../../../context/TransactionsProvider';
import { TransactionStatus } from '../../../../web3/TransactionManifest';

import { ViewportWidth, gradientShift } from '../../../../theme';
import { H2, P } from '../../../core/Typography';
import { Steps } from '../../../core/Steps';
import { Button } from '../../../core/Button';

import {
  SaveMigrationProvider,
  useMigrationSteps,
} from './SaveMigrationProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const ExchangeRate = styled.div`
  margin: 2rem 0 0;
  text-align: center;
  display: flex;
  font-size: 1rem;
  flex: 1;
  justify-content: center;

  span {
    ${({ theme }) => theme.mixins.numeric};
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const Card = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 1.5rem 3.5rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
  }

  p {
    font-size: 1rem;
    margin-bottom: 1rem;
    line-height: 1.5rem;

    span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  ${gradientShift}

  &:before {
    border-radius: 1.5rem;
  }
`;

const SaveMigrationContent: FC = () => {
  const [active, toggleActive] = useToggle(false);
  const steps = useMigrationSteps();
  const transactions = useTransactionsState();
  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const submitting = Object.values(transactions)
    .filter(tx => tx.manifest?.formId === 'saveMigration')
    .some(
      tx =>
        tx.status === TransactionStatus.Pending ||
        tx.status === TransactionStatus.Response ||
        tx.status === TransactionStatus.Sent,
    );

  const stepsComplete = steps.length && steps.every(step => step.complete);

  return (
    <Card>
      <Inner>
        <H2>
          {active ? (
            !stepsComplete ? (
              `Migration Assistant`
            ) : (
              `Migration Complete! 🎉`
            )
          ) : (
            <Button highlighted onClick={toggleActive}>
              Migrate your Save V1 balance
            </Button>
          )}
        </H2>
        {(!active || !stepsComplete) && (
          <P>
            To continue earning interest, please migrate your <b>Save V1</b>{' '}
            balance.
            <ExchangeRate>
              <div>
                <span>1</span>&nbsp; mUSD = &nbsp;
                <span>
                  {savingsContract?.latestExchangeRate?.rate.simple.toFixed(2)}
                </span>
                &nbsp; imUSD
              </div>
            </ExchangeRate>
          </P>
        )}
        {active && (
          <StepsContainer>
            {steps.length && <Steps steps={steps} pending={submitting} />}
          </StepsContainer>
        )}
      </Inner>
    </Card>
  );
};

export const SaveMigration: FC = () => (
  <SaveMigrationProvider>
    <SaveMigrationContent />
  </SaveMigrationProvider>
);
