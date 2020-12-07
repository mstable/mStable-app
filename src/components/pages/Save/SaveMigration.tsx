import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { SaveMigrationStep } from '../../../types';
import { H2, P } from '../../core/Typography';
import { Step } from './SaveMigrationStep';

interface Props {
  onSuccessfulMigrate: () => void;
}

const { WITHDRAW, APPROVE, DEPOSIT } = SaveMigrationStep;

const MIGRATION_STEPS = [WITHDRAW, APPROVE, DEPOSIT];

const Card = styled.div`
  margin-top: 2.5rem;
  padding: 1.5rem 3.5rem;
  border-radius: 1.5rem;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
  flex-direction: column;

  &:before {
    position: absolute;
    content: '';
    background: linear-gradient(
      45deg,
      rgb(255, 0, 0) 0%,
      rgb(255, 154, 0) 10%,
      rgb(208, 222, 33) 20%,
      rgb(79, 220, 74) 30%,
      rgb(63, 218, 216) 40%,
      rgb(47, 201, 226) 50%,
      rgb(28, 127, 238) 60%,
      rgb(95, 21, 242) 70%,
      rgb(186, 12, 248) 80%,
      rgb(251, 7, 217) 90%,
      rgb(255, 0, 0) 100%
    );
    filter: blur(0.25rem);
    inset: 1px;
    z-index: -1;
    border-radius: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    margin-bottom: 1rem;
    line-height: 1.5rem;

    span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30rem;
`;

const StepContainer = styled.div`
  position: relative;
  z-index: 0;
  width: 100%;

  &:before {
    position: absolute;
    width: 0.25rem;
    top: 0;
    bottom: 0;
    background: ${({ theme }) => theme.color.lightGrey};
    left: 1.75rem;
    content: '';
    z-index: -1;
  }
`;

export const SaveMigration: FC<Props> = ({ onSuccessfulMigrate }) => {
  const [activeStep, setActiveStep] = useState(WITHDRAW);
  const [pendingIndex, setPendingIndex] = useState<number | undefined>(
    undefined,
  );

  const increaseStepIndex = useCallback(() => setActiveStep(activeStep + 1), [
    activeStep,
  ]);

  const mapStepToAction = (step: SaveMigrationStep): void => {
    switch (step) {
      case WITHDRAW:
        // call withdrawal and wait
        break;
      case APPROVE:
        // call approve and wait
        break;
      case DEPOSIT:
        // call deposit and wait
        onSuccessfulMigrate();
        break;
      default:
        break;
    }
  };

  const handleStepSubmit = (step: SaveMigrationStep, index: number): void => {
    // 0 = exact
    // 1 = inf
    setPendingIndex(index);
    setTimeout(() => {
      mapStepToAction(step);
      increaseStepIndex();
      setPendingIndex(undefined);
    }, 2500);
  };

  const stepsCompleted = activeStep === MIGRATION_STEPS.length;

  return (
    <Card>
      <Inner>
        <H2>
          {!stepsCompleted ? `Migration Assistant` : `Migration Complete! 🎉`}
        </H2>
        {!stepsCompleted && (
          <P>
            To continue earning interest, please follow these steps to migrate
            your <b>Save V1</b> balance of <span>$230.00</span>.
          </P>
        )}
        <StepContainer>
          {!stepsCompleted &&
            MIGRATION_STEPS.map(step => (
              <Step
                key={`step-${step}`}
                active={activeStep === step}
                complete={activeStep > step}
                pendingIndex={pendingIndex}
                step={step}
                onClick={handleStepSubmit}
              />
            ))}
        </StepContainer>
      </Inner>
    </Card>
  );
};
