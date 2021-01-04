import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';

import { BubbleButton, UnstyledButton } from './Button';

enum MultiStepState {
  DEFAULT,
  APPROVE,
}

const { APPROVE, DEFAULT } = MultiStepState;

interface Props {
  className?: string;
  needsUnlock?: boolean;
  valid: boolean;
}

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
  flex: none;
  cursor: pointer;
`;

export const MultiStepButton: FC<Props> = ({
  className,
  valid,
  needsUnlock,
}) => {
  const [step, setStep] = useState<MultiStepState>(DEFAULT);

  const changeState = useCallback(
    (newStep: MultiStepState) => setStep(newStep),
    [],
  );

  const handleDeposit = (): void => {
    if (needsUnlock) {
      changeState(APPROVE);
      return undefined;
    }
    // TODO: - handle deposit here
    return undefined;
  };

  return (
    <Container className={className}>
      {step === DEFAULT && (
        <Button highlighted={valid} onClick={handleDeposit}>
          Deposit
        </Button>
      )}
      {step === APPROVE && (
        <>
          <ApproveContainer>
            <Button
              highlighted
              scale={0.875}
              onClick={() => changeState(DEFAULT)}
            >
              <div>Approve</div>
              <div>Exact</div>
            </Button>
            <Button
              highlighted
              scale={0.875}
              onClick={() => changeState(DEFAULT)}
            >
              <div>Approve</div>
              <div>∞</div>
            </Button>
          </ApproveContainer>
          <CloseButton onClick={() => changeState(DEFAULT)}>✕</CloseButton>
        </>
      )}
    </Container>
  );
};
