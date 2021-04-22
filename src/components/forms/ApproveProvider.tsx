import React, { createContext, Dispatch, FC, SetStateAction, useContext, useMemo, useState } from 'react'
import { constants } from 'ethers'
import { ERC20__factory } from '@mstable/protocol/types/generated'

import { BigDecimal } from '../../web3/BigDecimal'
import { TransactionManifest } from '../../web3/TransactionManifest'

import { useHasPendingApproval, usePropose } from '../../context/TransactionsProvider'
import { useTokenAllowance, useTokenSubscription } from '../../context/TokensProvider'
import { Interfaces } from '../../types'
import { useSigner } from '../../context/AccountProvider'

export enum Mode {
  Exact = 'exact',
  Infinite = 'infinite',
  Zero = 'zero',
}

type HandleApprove = (mode: Mode) => void

interface Approve {
  mode: Mode
  setMode: Dispatch<SetStateAction<Mode>>
  hasPendingApproval: boolean
  isApproveEdgeCase: boolean
  needsApprove: boolean
}

const APPROVE_EDGE_CASES: Record<string, string> = {
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT', // Mainnet
  '0xb404c51bbc10dcbe948077f18a4b8e553d160084': 'USDT', // Ropsten
}

const INFINITE = new BigDecimal(constants.MaxUint256)

const handleApproveCtx = createContext<HandleApprove>(null as never)

const approveCtx = createContext<Approve>(null as never)

export const useApprove = (): [Approve, HandleApprove] => [useContext(approveCtx), useContext(handleApproveCtx)]

export const ApproveProvider: FC<{
  address: string
  spender: string
  amount?: BigDecimal
}> = ({ address, spender, amount, children }) => {
  const signer = useSigner()
  const propose = usePropose()

  const hasPendingApproval = useHasPendingApproval(address, spender)
  const token = useTokenSubscription(address)
  const tokenSymbol = token?.symbol
  const allowance = useTokenAllowance(address, spender)

  const [mode, setMode] = useState<Mode>(Mode.Infinite)

  const isApproveEdgeCase = !!(
    APPROVE_EDGE_CASES[address] &&
    amount &&
    allowance &&
    allowance.exact.gt(0) &&
    allowance.exact.lt(amount.exact)
  )

  const needsApprove = address !== spender && !!(allowance && amount?.exact.gt(allowance.exact))

  const handleApprove: HandleApprove = _mode => {
    setMode(_mode)

    const approveAmount = _mode === Mode.Infinite ? INFINITE : _mode === Mode.Zero ? BigDecimal.ZERO : amount

    if (!(signer && spender && approveAmount)) return

    propose<Interfaces.ERC20, 'approve'>(
      new TransactionManifest(ERC20__factory.connect(address, signer), 'approve', [spender, approveAmount.exact], {
        present: `Approve transfer${tokenSymbol ? ` of ${tokenSymbol}` : ''}`,
        past: `Approved transfer${tokenSymbol ? ` of ${tokenSymbol}` : ''}`,
      }),
    )
  }

  const value = useMemo(
    () => ({
      mode,
      setMode,
      hasPendingApproval,
      isApproveEdgeCase,
      needsApprove,
    }),
    [mode, hasPendingApproval, isApproveEdgeCase, needsApprove],
  )

  return (
    <handleApproveCtx.Provider value={handleApprove}>
      <approveCtx.Provider value={value}>{children}</approveCtx.Provider>
    </handleApproveCtx.Provider>
  )
}
