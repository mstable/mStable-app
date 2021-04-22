import { useEffect } from 'react'

import { useConnected, useAccount } from '../context/AccountProvider'
import { useTransactionsDispatch } from '../context/TransactionsProvider'
import { useChainIdCtx } from '../context/NetworkProvider'

export const ContractsUpdater = (): null => {
  const connected = useConnected()
  const account = useAccount()
  const [chainId] = useChainIdCtx()
  const { reset } = useTransactionsDispatch()

  // When the account/chain changes, reset the transactions state.
  useEffect(reset, [account, chainId, connected, reset])

  return null
}
