import React, { FC, ReactNode, useMemo } from 'react'
import styled from 'styled-components'

import { Transaction, useTransactionsDispatch, useTransactionsState } from '../../context/TransactionsProvider'
import { TransactionManifest, TransactionStatus } from '../../web3/TransactionManifest'
import { Form, SubmitButton } from '../core/Form'
import { H3 } from '../core/Typography'

interface Props {
  className?: string
  compact?: boolean
  confirm?: ReactNode
  confirmLabel: JSX.Element | string
  createTransaction(formId: string): TransactionManifest<never, never> | void
  formId: string
  input?: ReactNode
  valid: boolean
}

const Container = styled.div<{ compact?: boolean }>`
  padding-bottom: ${({ compact }) => (compact ? 4 : 16)}px;

  > * {
    padding-bottom: ${({ compact }) => (compact ? 4 : 16)}px;
  }
`

const useFormTransaction = (formId: string): Transaction | undefined => {
  const state = useTransactionsState()
  return useMemo(
    () =>
      Object.values(state)
        .filter(tx => tx?.manifest?.formId === formId)
        .sort((a, b) => b.manifest.createdAt - a.manifest.createdAt)?.[0],
    [formId, state],
  )
}

/**
 * @deprecated
 */
export const TransactionForm: FC<Props> = ({ className, compact, confirm, confirmLabel, createTransaction, formId, input, valid }) => {
  const { propose } = useTransactionsDispatch()
  const transaction = useFormTransaction(formId)
  const submitting = transaction?.status === TransactionStatus.Pending

  return (
    <Container className={className}>
      {input && <Form submitting={submitting}>{input}</Form>}
      <div>
        <>
          {!compact && <H3>Confirm transaction</H3>}
          <SubmitButton
            type="button"
            onClick={() => {
              const manifest = createTransaction(formId)
              if (manifest) {
                propose(manifest)
              }
            }}
            disabled={!valid || submitting}
          >
            {confirmLabel}
          </SubmitButton>
          <div>{confirm}</div>
        </>
      </div>
    </Container>
  )
}
