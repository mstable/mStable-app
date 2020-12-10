import React, { FC } from 'react';
import styled from 'styled-components';
import { ViewportWidth } from '../../../theme';
import { H2, P } from '../../core/Typography';
import { useMigrationSteps } from './saveMigration/SaveMigrationProvder';
import { Steps } from '../../core/Steps';

const Card = styled.div`
  margin-top: 2.5rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 1.5rem 3.5rem;
  }

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
    animation: GradientShift 5s ease alternate infinite;
    background-size: 300% 300%;
  }

  @keyframes GradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
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
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 32rem;
`;

export const SaveMigration: FC = () => {
  const steps = useMigrationSteps();

  const stepsCompleted = steps.every(step => step.isCompleted);

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
        <Steps steps={steps} />
      </Inner>
    </Card>
  );
};
