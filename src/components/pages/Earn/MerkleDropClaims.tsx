import React, { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useAccount, useSigner } from '../../../context/AccountProvider'
import { MerkleDrop } from '../../../context/earn/types'
import { useMerkleDrops } from '../../../context/earn/EarnDataProvider'

import { useTransactionsState } from '../../../context/TransactionsProvider'
import { BigDecimal } from '../../../web3/BigDecimal'
import { TransactionManifest, TransactionStatus } from '../../../web3/TransactionManifest'
import { humanizeList } from '../../../utils/strings'
import { MerkleDrop__factory } from '../../../typechain'
import { Amount, NumberFormat } from '../../core/Amount'
import { H3, P } from '../../core/Typography'
import { Tooltip } from '../../core/ReactTooltip'
import { Protip } from '../../core/Protip'
import { Size } from '../../../theme'
import { Interfaces } from '../../../types'
import { TransactionForm } from '../../forms/TransactionForm'

const Container = styled.div`
  min-width: 260px;
`

const WeeksLabel = styled.div`
  font-size: 12px;
`

const ConfirmAmount = styled.div`
  font-size: 16px;
`

const MerkleDropConfirmLabel: FC<{
  amount: BigDecimal
  tranches: string[]
  symbol: string
  decimals: number
}> = ({ amount, symbol, tranches }) => (
  <>
    <ConfirmAmount>
      <Amount format={NumberFormat.Long} amount={amount} decimalPlaces={10} /> {symbol}
    </ConfirmAmount>
    <WeeksLabel>
      Claim week{tranches.length > 1 ? 's' : ''} {humanizeList(tranches)}
    </WeeksLabel>
  </>
)

const MerkleDropClaimForm: FC<{ merkleDrop: MerkleDrop }> = ({ merkleDrop }) => {
  const [txId, setTxId] = useState<string | undefined>()
  const transactions = useTransactionsState()
  const account = useAccount()
  const signer = useSigner()
  const {
    totalUnclaimed,
    address,
    unclaimedTranches,
    token: { symbol, decimals },
  } = merkleDrop

  const { refresh } = useMerkleDrops()

  const createTransaction = useCallback(
    (formId: string): TransactionManifest<Interfaces.MerkleDrop, 'claimWeeks' | 'claimWeek'> | void => {
      if (account && unclaimedTranches && signer) {
        const contract = MerkleDrop__factory.connect(address, signer)

        const tranches = unclaimedTranches.map(t => t.trancheNumber)
        const balances = unclaimedTranches.map(t => t.allocation)
        const proofs = unclaimedTranches.map(t => t.proof)

        const purpose = {
          present: 'Claiming rewards',
          past: 'Claimed rewards',
        }

        const tx =
          tranches.length > 1
            ? new TransactionManifest<Interfaces.MerkleDrop, 'claimWeeks'>(
                contract,
                'claimWeeks',
                [account, tranches, balances, proofs as never],
                purpose,
                formId,
              )
            : new TransactionManifest<Interfaces.MerkleDrop, 'claimWeek'>(
                contract,
                'claimWeek',
                [account, tranches[0], balances[0], proofs[0]],
                purpose,
                formId,
              )

        setTxId(tx.id)
        return tx
      }
    },
    [account, address, signer, unclaimedTranches],
  )

  const transaction = txId ? transactions[txId] : undefined
  useEffect(() => {
    if (transaction?.status === TransactionStatus.Confirmed) {
      refresh()
    }
  }, [refresh, transaction])

  return (
    <TransactionForm
      formId="merkleClaim"
      compact
      confirmLabel={
        <MerkleDropConfirmLabel
          amount={totalUnclaimed}
          symbol={symbol}
          decimals={decimals}
          tranches={unclaimedTranches.map(t => t.trancheNumber.toString())}
        />
      }
      createTransaction={createTransaction}
      valid={unclaimedTranches.length > 0}
    />
  )
}

export const MerkleDropClaims: FC<{ className?: string }> = ({ className }) => {
  const account = useAccount()
  const { merkleDrops } = useMerkleDrops()

  const hasUnclaimedAmounts = Object.values(merkleDrops).some(d => d.totalUnclaimed.exact.gt(0))

  const hasSingleUnclaimedTranche = Object.values(merkleDrops).some(d => d.unclaimedTranches.length === 1)

  return (
    <Container className={className}>
      <Tooltip tip="Platform rewards (e.g. BAL) can be earned in some pools. When available, these rewards can be claimed here.">
        <H3>Claim rewards</H3>
      </Tooltip>
      {hasUnclaimedAmounts ? (
        <div>
          {Object.values(merkleDrops).map(merkleDrop => (
            <MerkleDropClaimForm merkleDrop={merkleDrop} key={merkleDrop.address} />
          ))}
        </div>
      ) : account ? (
        <div>No rewards to claim at this time.</div>
      ) : null}
      {hasSingleUnclaimedTranche ? (
        <Protip emoji="💸">
          <P size={Size.s}>
            If you are planning to stake across multiple weeks, you can wait and claim all rewards (of the same token) in one transaction!
          </P>
        </Protip>
      ) : null}
    </Container>
  )
}
