/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { BigDecimal } from '../../web3/BigDecimal'
import { ApproveProvider, Mode, useApprove } from './ApproveProvider'
import { Button, UnstyledButton } from '../core/Button'
import { Tooltip } from '../core/ReactTooltip'

const SLIPPAGE_WARNING = 'This transaction has a price impact of at least 0.4%. Please confirm you would like to continue'

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
  penaltyBonusAmount?: number
}

const StyledButton = styled(Button)<{ isPenalty?: boolean; isBonus?: boolean }>`
  width: 100%;
  height: 3.75rem;
  border-radius: 2rem;
  background: ${({ isBonus, isPenalty, theme }) => (isPenalty ? theme.color.red : isBonus && theme.color.orange)};
`

const CloseButton = styled(UnstyledButton)`
  background: ${({ theme }) => theme.color.backgroundAccent};
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

const SendButtonContent: FC<Omit<Props, 'approve'>> = ({ className, valid, title, handleSend, penaltyBonusAmount }) => {
  const isBonus = (penaltyBonusAmount ?? 0) > 0
  return (
    <Container className={className}>
      <StyledButton
        isBonus={isBonus && !!penaltyBonusAmount}
        isPenalty={!isBonus && !!penaltyBonusAmount}
        highlighted={valid}
        disabled={!valid}
        onClick={async () => {
          if (!valid) return

          if (penaltyBonusAmount) {
            if (!confirm(SLIPPAGE_WARNING)) {
              return
            }
          }

          handleSend()
        }}
      >
        {`${title} ${!!penaltyBonusAmount && valid ? 'anyway' : ''}`}
      </StyledButton>
    </Container>
  )
}

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

const SendWithApproveContent: FC<Omit<Props, 'approve'>> = ({ className, valid, title, handleSend, penaltyBonusAmount }) => {
  const [sendError, setSendError] = useState<string | undefined>()
  const isBonus = (penaltyBonusAmount ?? 0) > 0

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
          isBonus={isBonus && !!penaltyBonusAmount}
          isPenalty={!isBonus && !!penaltyBonusAmount}
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

            if (penaltyBonusAmount) {
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
          {`${title} ${!!penaltyBonusAmount && valid ? 'anyway' : ''}`}
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

export const SendButton: FC<Props> = ({ approve, className, handleSend, title, valid, penaltyBonusAmount }) =>
  approve ? (
    <ApproveProvider address={approve.address} spender={approve.spender} amount={approve.amount}>
      <SendWithApproveContent
        className={className}
        valid={valid}
        title={title}
        handleSend={handleSend}
        penaltyBonusAmount={penaltyBonusAmount}
      />
    </ApproveProvider>
  ) : (
    <SendButtonContent className={className} valid={valid} title={title} handleSend={handleSend} penaltyBonusAmount={penaltyBonusAmount} />
  )
