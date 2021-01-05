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
  title: string;
}

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

const ApproveContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  justify-content: space-between;

  > * {
    flex-basis: calc(50% - 0.25rem);
  }
`;

const Container = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
`;

// TODO: - make generic & rename
export const MultiStepButton: FC<Props> = ({
  className,
  valid,
  needsUnlock,
  title,
}) => {
  const [step, setStep] = useState<MultiStepState>(DEFAULT);

  const handleApprove = useCallback((): void => {
    // TODO: - add approve tx logic + on callback change state.
    setStep(DEFAULT);
  }, []);

  const handleDeposit = useCallback((): void => {
    if (!valid && needsUnlock) return;
    if (needsUnlock) {
      setStep(APPROVE);
    } else {
      // TODO: -
      // handle unlocked state & deposit call
    }
  }, [setStep, needsUnlock, valid]);

  return (
    <Container className={className}>
      {step === DEFAULT && (
        <Button highlighted={valid} disabled={!valid} onClick={handleDeposit}>
          {title}
        </Button>
      )}
      {step === APPROVE && (
        <>
          <ApproveContainer>
            <Button highlighted scale={0.875} onClick={handleApprove}>
              <div>Approve</div>
              <div>Exact</div>
            </Button>
            <Button highlighted scale={0.875} onClick={handleApprove}>
              <div>Approve</div>
              <div>∞</div>
            </Button>
          </ApproveContainer>
          <CloseButton onClick={() => setStep(DEFAULT)}>✕</CloseButton>
        </>
      )}
    </Container>
  );
};
