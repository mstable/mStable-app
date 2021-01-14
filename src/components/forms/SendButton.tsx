import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import { BigDecimal } from '../../web3/BigDecimal';
import { ApproveProvider, useApprove } from './ApproveProvider';
import { Button, UnstyledButton } from '../core/Button';
import { Tooltip } from '../core/ReactTooltip';

enum Step {
  ACTION,
  APPROVE,
}

interface Props {
  className?: string;
  valid: boolean;
  title: string;
  handleSend: (() => Promise<void>) | (() => void);
  approve?: {
    spender: string;
    address: string;
    amount?: BigDecimal;
  };
}

const StyledButton = styled(Button)`
  width: 100%;
  height: 4rem;
  border-radius: 2rem;
`;

const CloseButton = styled(UnstyledButton)`
  background: ${({ theme }) => theme.color.accent};
  width: 2.25rem;
  height: 2.25rem;
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
  gap: 1rem;
  align-items: center;
`;

const Container = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
`;

const SendButtonContent: FC<Omit<Props, 'approve'>> = ({
  className,
  valid,
  title,
  handleSend,
}) => (
  <Container className={className}>
    <StyledButton highlighted={valid} disabled={!valid} onClick={handleSend}>
      {title}
    </StyledButton>
  </Container>
);

const SendWithApproveContent: FC<Omit<Props, 'approve'>> = ({
  className,
  valid,
  title,
  handleSend,
}) => {
  const [sendError, setSendError] = useState<string | undefined>();

  const [
    { needsApprove, hasPendingApproval, isApproveEdgeCase, mode },
    handleApprove,
  ] = useApprove();

  const [step, setStep] = useState<Step>(Step.ACTION);

  useEffect(() => {
    if (needsApprove) return;

    setStep(Step.ACTION);
  }, [needsApprove]);

  return (
    <Container className={className}>
      {step === Step.ACTION ? (
        <StyledButton
          highlighted={valid}
          disabled={!valid}
          onClick={async () => {
            if (!valid && needsApprove) return;

            if (sendError) {
              return setSendError(undefined);
            }

            if (needsApprove) {
              return setStep(Step.APPROVE);
            }

            try {
              await handleSend();
            } catch (error) {
              setSendError(error);
            }
          }}
        >
          {title}
        </StyledButton>
      ) : (
        <ApproveContainer>
          {isApproveEdgeCase ? (
            <StyledButton
              highlighted
              disabled={hasPendingApproval}
              scale={0.875}
              onClick={() => handleApprove('zero')}
            >
              <Tooltip
                tip="The approved amount is less than the required amount, but this token requires resetting the approved amount first."
                hideIcon
              >
                <div>
                  {hasPendingApproval && mode === 'zero'
                    ? 'Resetting'
                    : 'Reset'}
                </div>
              </Tooltip>
            </StyledButton>
          ) : (
            <>
              <StyledButton
                highlighted
                disabled={hasPendingApproval}
                scale={0.875}
                onClick={() => handleApprove('exact')}
              >
                <Tooltip
                  tip="Approve this contract to spend enough for this transaction"
                  hideIcon
                >
                  <div>
                    {hasPendingApproval && mode === 'exact'
                      ? 'Approving'
                      : 'Approve'}
                  </div>
                  <div>Exact</div>
                </Tooltip>
              </StyledButton>
              <StyledButton
                highlighted
                disabled={hasPendingApproval}
                scale={0.875}
                onClick={() => handleApprove('infinite')}
              >
                <Tooltip
                  tip="Approve this contract to spend an infinite amount"
                  hideIcon
                >
                  <div>
                    {hasPendingApproval && mode === 'infinite'
                      ? 'Approving'
                      : 'Approve'}
                  </div>
                  <div>∞</div>
                </Tooltip>
              </StyledButton>
            </>
          )}
          <CloseButton onClick={() => setStep(Step.ACTION)}>✕</CloseButton>
        </ApproveContainer>
      )}
    </Container>
  );
};

export const SendButton: FC<Props> = ({
  approve,
  className,
  handleSend,
  title,
  valid,
}) =>
  approve ? (
    <ApproveProvider
      address={approve.address}
      spender={approve.spender}
      amount={approve.amount}
    >
      <SendWithApproveContent
        className={className}
        valid={valid}
        title={title}
        handleSend={handleSend}
      />
    </ApproveProvider>
  ) : (
    <SendButtonContent
      className={className}
      valid={valid}
      title={title}
      handleSend={handleSend}
    />
  );
