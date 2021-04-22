import { useEffect } from 'react'
import { usePrevious } from 'react-use'
import { Provider, TransactionReceipt } from '@ethersproject/abstract-provider'
import { Signer } from 'ethers'

import { TransactionStatus } from '../web3/TransactionManifest'
import { useSignerOrProvider, useAccount } from '../context/AccountProvider'
import { useBlockNow } from '../context/BlockProvider'

import { useTransactionsDispatch, useTransactionsState } from '../context/TransactionsProvider'

const STATUS_NEEDS_CHECK = [TransactionStatus.Pending, TransactionStatus.Sent, TransactionStatus.Response]

/**
 * Update the state of affected transactions when the provider or
 * block number changes.
 */
export const TransactionsUpdater = (): null => {
  const account = useAccount()
  const accountPrev = usePrevious(account)
  const provider = useSignerOrProvider()
  const blockNumber = useBlockNow()

  const state = useTransactionsState()
  const { check, finalize, reset } = useTransactionsDispatch()

  /**
   * Reset transactions state on account change
   */
  useEffect(() => {
    if (accountPrev !== account) {
      reset()
    }
  }, [account, accountPrev, reset])

  /**
   * Check pending transaction status on new blocks, and finalize if possible.
   */
  useEffect(
    (): (() => void) | void => {
      if (provider && blockNumber) {
        let stale = false
        Object.values(state)
          .filter(tx => STATUS_NEEDS_CHECK.includes(tx.status) && tx.hash && tx.blockNumber !== blockNumber)
          .forEach(tx => {
            ;(((provider as Signer).provider || provider) as Provider)
              .getTransactionReceipt(tx.hash as string)
              .then((receipt: TransactionReceipt) => {
                if (!stale) {
                  if (!receipt) {
                    check(tx.manifest.id, blockNumber)
                  } else {
                    finalize(tx.manifest, receipt)
                  }
                }
              })
              .catch(() => {
                check(tx.manifest.id, blockNumber)
              })
          })

        return () => {
          stale = true
        }
      }
      return undefined
    },
    // `blockNumber` and `provider` should be the only deps; otherwise it will
    // check too often.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockNumber, provider],
  )

  return null
}
