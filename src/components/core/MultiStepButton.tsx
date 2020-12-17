import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';

import { BubbleButton, UnstyledButton } from './Button';

enum MultiStepState {
  DEFAULT,
  APPROVE,
  ACTION,
}

const { DEFAULT, APPROVE, ACTION } = MultiStepState;

const Container = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
`;

const ApproveContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  justify-content: space-between;

  > * {
    flex-basis: calc(50% - 0.25rem);
  }
`;

const Button = styled(BubbleButton)`
  width: 100%;
  height: 4rem;
  border-radius: 2rem;
`;

const CloseButton = styled(UnstyledButton)`
  background: #eee;
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 1rem;
  text-align: center;
  border-radius: 1.125rem;
`;

export const MultiStepButton: FC<{ className?: string }> = ({ className }) => {
  const [step, setStep] = useState<MultiStepState>(DEFAULT);

  const changeState = useCallback(
    (newStep: MultiStepState) => setStep(newStep),
    [],
  );

  return (
    <Container className={className}>
      {step === DEFAULT && (
        <Button onClick={() => changeState(APPROVE)}>Deposit</Button>
      )}
      {step === APPROVE && (
        <>
          <ApproveContainer>
            <Button
              highlighted
              scale={0.875}
              onClick={() => changeState(ACTION)}
            >
              <div>Approve</div>
              <div>Exact</div>
            </Button>
            <Button
              highlighted
              scale={0.875}
              onClick={() => changeState(ACTION)}
            >
              <div>Approve</div>
              <div>∞</div>
            </Button>
          </ApproveContainer>
          <CloseButton onClick={() => changeState(DEFAULT)}>✕</CloseButton>
        </>
      )}
      {step === ACTION && (
        <Button highlighted onClick={() => changeState(APPROVE)}>
          Deposit
        </Button>
      )}
    </Container>
  );
};
