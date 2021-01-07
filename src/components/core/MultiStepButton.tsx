import React, { FC, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { BubbleButton, UnstyledButton } from './Button';

export type ApproveType = 'exact' | 'inf';

enum MultiStepState {
  ACTION,
  APPROVE,
}

const { APPROVE, ACTION } = MultiStepState;

interface Props {
  className?: string;
  needsUnlock?: boolean;
  valid: boolean;
  title: string;
  onApproveClick: (type: ApproveType) => void;
  onActionClick: () => void;
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
  onApproveClick,
  onActionClick,
}) => {
  const [step, setStep] = useState<MultiStepState>(ACTION);
  
  const handleAction = useCallback((): void => {
    if (!valid && needsUnlock) return;
    if (needsUnlock) {
      setStep(APPROVE);
    } else {
      onActionClick();
    }
  }, [setStep, needsUnlock, valid, onActionClick]);

  useEffect(() => {
    if (needsUnlock) return;
    setStep(ACTION);
  }, [needsUnlock])
  
  return (
    <Container className={className}>
      {step === ACTION && (
        <Button highlighted={valid} disabled={!valid} onClick={handleAction}>
          {title}
        </Button>
      )}
      {step === APPROVE && (
        <>
          <ApproveContainer>
            <Button
              highlighted
              scale={0.875}
              onClick={() => onApproveClick('exact')}
            >
              <div>Approve</div>
              <div>Exact</div>
            </Button>
            <Button
              highlighted
              scale={0.875}
              onClick={() => onApproveClick('inf')}
            >
              <div>Approve</div>
              <div>∞</div>
            </Button>
          </ApproveContainer>
          <CloseButton onClick={() => setStep(ACTION)}>✕</CloseButton>
        </>
      )}
    </Container>
  );
};
