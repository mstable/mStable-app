/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { BigDecimal } from '../../web3/BigDecimal'
import { ApproveProvider, Mode, useApprove } from './ApproveProvider'
import { Button, UnstyledButton } from '../core/Button'
import { Tooltip } from '../core/ReactTooltip'

const SLIPPAGE_WARNING = 'This transaction has a price impact of at least 0.1%. Please confirm you would like to continue'

enum Step {
  ACTION,
  APPROVE,
}

interface Props {
  className?: string
  valid: boolean
  title: string
  handleSend: (() => Promise<void>) | (() => void)
  approve?: {
    spender: string
    address: string
    amount?: BigDecimal
  }
  warning?: boolean
}

const StyledButton = styled(Button)<{ warning?: boolean }>`
  width: 100%;
  height: 3.75rem;
  border-radius: 2rem;
  background: ${({ warning, theme }) => warning && theme.color.red};
`

const CloseButton = styled(UnstyledButton)`
  background: ${({ theme }) => theme.color.background[2]};
  width: 2.25rem;
  height: 2.25rem;
  text-align: center;
  border-radius: 1.125rem;
  flex: none;
  cursor: pointer;
`

const ApproveContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  > button:not(:last-child) {
    margin-right: 0.75rem;
  }
`

const Container = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
`

const SendButtonContent: FC<Omit<Props, 'approve'>> = ({ className, valid, title, handleSend, warning = false }) => (
  <Container className={className}>
    <StyledButton
      warning={warning}
      highlighted={valid}
      disabled={!valid}
      onClick={async () => {
        if (!valid) return
        if (warning && !confirm(SLIPPAGE_WARNING)) return

        handleSend()
      }}
    >
      {`${title} ${warning && valid ? 'anyway' : ''}`}
    </StyledButton>
  </Container>
)

export const ApproveContent: FC<{
  onApproveClick: (mode: Mode) => void
  mode?: Mode
  onCloseClick: () => void
  hasPendingApproval: boolean
  isApproveEdgeCase?: boolean
  className?: string
}> = ({ onApproveClick, mode, onCloseClick, hasPendingApproval, isApproveEdgeCase, className }) => (
  <ApproveContainer className={className}>
    {isApproveEdgeCase ? (
      <StyledButton
        highlighted
        disabled={hasPendingApproval}
        onClick={() => {
          onApproveClick(Mode.Zero)
        }}
      >
        <Tooltip
          tip="The approved amount is less than the required amount, but this token requires resetting the approved amount first."
          hideIcon
        >
          <div>{hasPendingApproval && mode === Mode.Zero ? 'Resetting' : 'Reset'}</div>
        </Tooltip>
      </StyledButton>
    ) : (
      <>
        <StyledButton
          highlighted
          disabled={hasPendingApproval}
          onClick={() => {
            onApproveClick(Mode.Exact)
          }}
        >
          <Tooltip tip="Approve this contract to spend enough for this transaction" hideIcon>
            <div>
              {hasPendingApproval && mode === 'exact' ? 'Approving' : 'Approve'}
              {' Exact'}
            </div>
          </Tooltip>
        </StyledButton>
        <StyledButton
          highlighted
          disabled={hasPendingApproval}
          onClick={() => {
            onApproveClick(Mode.Infinite)
          }}
        >
          <Tooltip tip="Approve this contract to spend an infinite amount" hideIcon>
            <div>
              {hasPendingApproval && mode === Mode.Infinite ? 'Approving' : 'Approve'}
              {' ∞'}
            </div>
          </Tooltip>
        </StyledButton>
      </>
    )}
    <CloseButton onClick={onCloseClick}>✕</CloseButton>
  </ApproveContainer>
)

const SendWithApproveContent: FC<Omit<Props, 'approve'>> = ({ className, valid, title, handleSend, warning = false }) => {
  const [sendError, setSendError] = useState<string | undefined>()
  const [{ needsApprove, hasPendingApproval, isApproveEdgeCase, mode }, handleApprove] = useApprove()
  const [step, setStep] = useState<Step>(Step.ACTION)

  useEffect(() => {
    if (needsApprove) return
    setStep(Step.ACTION)
  }, [needsApprove])

  return (
    <Container className={className}>
      {step === Step.ACTION ? (
        <StyledButton
          warning={warning}
          highlighted={valid}
          disabled={!valid}
          onClick={async () => {
            if (!valid && needsApprove) return

            if (sendError) {
              return setSendError(undefined)
            }

            if (needsApprove) {
              return setStep(Step.APPROVE)
            }

            if (warning) {
              if (!confirm(SLIPPAGE_WARNING)) {
                return
              }
            }

            try {
              await handleSend()
            } catch (error) {
              setSendError(error)
            }
          }}
        >
          {`${title} ${warning && valid ? 'anyway' : ''}`}
        </StyledButton>
      ) : (
        <ApproveContent
          mode={mode}
          onApproveClick={handleApprove}
          onCloseClick={() => setStep(Step.ACTION)}
          hasPendingApproval={hasPendingApproval}
          isApproveEdgeCase={isApproveEdgeCase}
        />
      )}
    </Container>
  )
}

export const SendButton: FC<Props> = ({ approve, className, handleSend, title, valid, warning }) =>
  approve ? (
    <ApproveProvider address={approve.address} spender={approve.spender} amount={approve.amount}>
      <SendWithApproveContent className={className} valid={valid} title={title} handleSend={handleSend} warning={warning} />
    </ApproveProvider>
  ) : (
    <SendButtonContent className={className} valid={valid} title={title} handleSend={handleSend} warning={warning} />
  )
