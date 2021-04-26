import React, { FC } from 'react'
import styled from 'styled-components'

import { useTransactionsDispatch, useTransactionsState } from '../../context/TransactionsProvider'
import { useNetworkPrices } from '../../context/NetworkProvider'
import { TransactionStatus } from '../../web3/TransactionManifest'
import { BigDecimal } from '../../web3/BigDecimal'

import { Button } from '../core/Button'
import { GasStation } from './GasStation'
import { useGas } from './TransactionGasProvider'
import { useNativeToken } from '../../context/TokensProvider'
import { TokenIcon } from '../icons/TokenIcon'
import { Amount } from '../core/Amount'

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
`

const Purpose = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  > :first-child {
    font-size: 1.3rem;
    line-height: 1.7rem;
  }
`

const TxError = styled.div`
  font-size: 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.color.redTransparent};
  > div {
    font-size: 0.8rem;
    font-weight: 600;
  }
`

const Container = styled.div<{ status: TransactionStatus }>`
  width: 24rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 1px
    ${({ status, theme }) =>
      status === TransactionStatus.Confirmed
        ? theme.color.green
        : status === TransactionStatus.Error
        ? theme.color.red
        : theme.color.lightGrey}
    solid;
  border-radius: 1rem;
  color: ${({ theme }) => theme.color.body};
  background: ${({ theme }) => theme.color.background};
`

const NativeTokenBalanceContainer = styled.div<{ insufficientBalance: boolean }>`
  > div:first-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    img {
      width: 1.5rem;
    }
    color: ${({ insufficientBalance, theme }) => (insufficientBalance ? theme.color.red : 'inherit')};
  }
`

const NativeTokenBalance: FC = () => {
  const { insufficientBalance } = useGas()
  const nativeToken = useNativeToken()
  const networkPrices = useNetworkPrices()

  return (
    <NativeTokenBalanceContainer insufficientBalance={insufficientBalance}>
      <div>
        <TokenIcon symbol={nativeToken.symbol} hideNetwork />
        <Amount amount={nativeToken.balance} price={BigDecimal.maybeParse(networkPrices.value?.nativeToken?.toFixed(4))} />
      </div>
    </NativeTokenBalanceContainer>
  )
}

export const PendingTransaction: FC<{
  id: string
}> = ({ id }) => {
  const { [id]: transaction } = useTransactionsState()
  const { cancel, send } = useTransactionsDispatch()
  const { estimationError, gasLimit, gasPrice, insufficientBalance } = useGas()

  if (!transaction) {
    return null
  }

  const disabled = !!(estimationError || !gasLimit || !gasPrice || insufficientBalance || transaction.status !== TransactionStatus.Pending)

  return (
    <Container status={transaction.status}>
      <Purpose>
        <div>{transaction.manifest.purpose.present}</div>
        <NativeTokenBalance />
      </Purpose>
      {transaction.status === TransactionStatus.Pending && <GasStation />}
      {estimationError && (
        <TxError>
          <div>Error during estimation</div>
          {estimationError}
        </TxError>
      )}
      <Buttons>
        <Button
          scale={0.7}
          onClick={() => {
            cancel(transaction.manifest.id)
          }}
        >
          Cancel
        </Button>
        <Button
          scale={0.7}
          highlighted={!disabled}
          disabled={disabled}
          onClick={() => {
            if (gasPrice && gasLimit) {
              send(transaction.manifest, gasLimit, gasPrice)
            }
          }}
        >
          Send transaction
        </Button>
      </Buttons>
    </Container>
  )
}
