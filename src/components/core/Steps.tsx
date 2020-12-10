import React, { FC } from 'react';
import styled from 'styled-components';
import { Step } from '../pages/Save/SaveMigrationStep';
import { StepProps } from '../pages/Save/saveMigration/types';


export interface Props {
  steps: StepProps[];
}

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
    content: '';
    z-index: -1;
    left: 1rem;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    &:before {
      left: 1.75rem;
      width: 0.25rem;
    }
  }
`;

export const Steps: FC<Props> = ({ steps }) => {
  const stepsCompleted = steps.every(step => step.isCompleted);
  const activeStep =
    steps.filter(step => !step.isCompleted)?.[0] ?? steps[steps.length - 1];
  return (
    <StepContainer>
      {!stepsCompleted &&
        activeStep &&
        steps.map(
          ({
            key,
            isCompleted,
            buttonTitle,
            title,
            isPending,
            isActive,
            onClick,
          }) => (
            <Step
              key={`step-${key}`}
              isCompleted={isCompleted}
              isPending={isPending}
              buttonTitle={buttonTitle}
              title={title}
              onClick={onClick}
              isActive={isActive}
            />
          ),
        )}
    </StepContainer>
  );
};
