/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, FC, Reducer, useCallback, useContext, useMemo, useReducer } from 'react'
import { BigNumber } from 'ethers'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'

import { TransactionManifest, TransactionStatus } from '../web3/TransactionManifest'
import { Instances, Interfaces } from '../types'
import { useAddErrorNotification, useAddInfoNotification, useAddSuccessNotification } from './NotificationsProvider'
import { useGetExplorerUrl } from './NetworkProvider'

enum Actions {
  Cancel,
  Check,
  Error,
  Finalize,
  Propose,
  Reset,
  Response,
  Send,
}

export interface Transaction {
  manifest: TransactionManifest<any, any>

  status: TransactionStatus

  blockNumberChecked?: number

  blockNumber?: number

  hash?: string

  to?: string

  error?: string
}

interface State {
  [id: string]: Transaction
}

interface Dispatch {
  cancel(id: string): void

  check(id: string, blockNumber: number): void

  finalize(manifest: TransactionManifest<any, any>, receipt: TransactionReceipt): void

  propose<TIface extends Interfaces, TFn extends keyof Instances[TIface]['functions']>(manifest: TransactionManifest<TIface, TFn>): void

  reset(): void

  send(manifest: TransactionManifest<never, never>, gasLimit: BigNumber, gasPrice: number): void
}

type Action =
  | { type: Actions.Reset }
  | {
      type: Actions.Propose
      payload: TransactionManifest<never, never>
    }
  | { type: Actions.Send; payload: { id: string } }
  | { type: Actions.Check; payload: { id: string; blockNumber: number } }
  | {
      type: Actions.Finalize
      payload: { id: string; receipt: TransactionReceipt }
    }
  | {
      type: Actions.Response
      payload: { id: string; response: TransactionResponse }
    }
  | { type: Actions.Error; payload: { id: string; error: string } }
  | { type: Actions.Cancel; payload: { id: string } }

const transactionsCtxReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Check: {
      const { id, blockNumber } = action.payload
      return {
        ...state,
        [id]: {
          ...state[id],
          blockNumberChecked: blockNumber,
        },
      }
    }

    case Actions.Finalize: {
      const {
        id,
        receipt: { status, blockNumber, transactionHash },
      } = action.payload
      return {
        ...state,
        [id]: {
          ...state[id],
          blockNumberChecked: blockNumber,
          hash: transactionHash,
          status: status === 1 ? TransactionStatus.Confirmed : TransactionStatus.Error,
        },
      }
    }

    case Actions.Response: {
      const {
        id,
        response: { hash, to, blockNumber },
      } = action.payload
      return {
        ...state,
        [id]: {
          ...state[id],
          status: TransactionStatus.Response,
          hash,
          to,
          blockNumber,
        },
      }
    }

    case Actions.Propose: {
      return {
        ...state,
        [action.payload.id]: {
          status: TransactionStatus.Pending,
          manifest: action.payload,
        },
      }
    }

    case Actions.Send: {
      const { id } = action.payload
      return {
        ...state,
        [id]: {
          ...state[id],
          status: TransactionStatus.Sent,
        },
      }
    }

    case Actions.Cancel: {
      const { [action.payload.id]: _, ...newState } = state

      return newState
    }

    case Actions.Error: {
      const { id, error } = action.payload
      return {
        ...state,
        [id]: {
          ...state[id],
          status: TransactionStatus.Error,
          error,
        },
      }
    }

    case Actions.Reset:
      return {}

    default:
      throw new Error('Unhandled action')
  }
}

const stateCtx = createContext<State>(null as never)
const dispatchCtx = createContext<Dispatch>(null as never)

export const useTransactionsState = (): State => useContext(stateCtx)

export const useTransactionsDispatch = (): Dispatch => useContext(dispatchCtx)

export const usePropose = (): Dispatch['propose'] => useContext(dispatchCtx).propose

export const useOrderedCurrentTransactions = (): Transaction[] => {
  const state = useTransactionsState()
  return useMemo(() => {
    return Object.values(state).sort((a, b) => b.manifest.createdAt - a.manifest.createdAt)
  }, [state])
}

export const useHasPendingApproval = (address: string, spender: string): boolean => {
  const state = useTransactionsState()
  return Object.values(state).some(
    tx =>
      tx.status !== TransactionStatus.Confirmed &&
      tx.manifest &&
      tx.manifest.fn === 'approve' &&
      tx.manifest.args[0] === spender &&
      tx.to === address,
  )
}

const getTxExplorerAttrs = (
  hash: string,
  getExplorerUrl: (hash: string, type: 'transaction') => string,
): { href: string; title: string } => ({
  title: 'View on explorer',
  href: getExplorerUrl(hash, 'transaction'),
})

export const TransactionsProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsCtxReducer, {})
  const addSuccessNotification = useAddSuccessNotification()
  const addInfoNotification = useAddInfoNotification()
  const addErrorNotification = useAddErrorNotification()
  const getExplorerUrl = useGetExplorerUrl()

  const propose = useCallback<Dispatch['propose']>(
    tx => {
      dispatch({
        type: Actions.Propose,
        payload: tx,
      })
    },
    [dispatch],
  )

  const reset = useCallback<Dispatch['reset']>(() => {
    dispatch({ type: Actions.Reset })
  }, [dispatch])

  const cancel = useCallback<Dispatch['cancel']>(
    id => {
      dispatch({ type: Actions.Cancel, payload: { id } })
    },
    [dispatch],
  )

  const finalize = useCallback<Dispatch['finalize']>(
    (manifest, receipt) => {
      dispatch({
        type: Actions.Finalize,
        payload: { id: manifest.id, receipt },
      })

      if (receipt.status === 1) {
        addSuccessNotification(
          'Transaction confirmed',
          manifest.purpose.past,
          getTxExplorerAttrs(receipt.transactionHash as string, getExplorerUrl),
        )
      } else {
        addErrorNotification(
          'Transaction failed',
          manifest.purpose.past,
          getTxExplorerAttrs(receipt.transactionHash as string, getExplorerUrl),
        )
      }
    },
    [addErrorNotification, addSuccessNotification, getExplorerUrl],
  )

  const check = useCallback<Dispatch['check']>((id, blockNumber) => {
    dispatch({ type: Actions.Check, payload: { id, blockNumber } })
  }, [])

  const send = useCallback<Dispatch['send']>(
    (manifest, gasLimit, gasPrice) => {
      const { id } = manifest
      dispatch({ type: Actions.Send, payload: { id } })

      let hash: string

      manifest
        .send(gasLimit, gasPrice)
        .then(response => {
          dispatch({
            type: Actions.Response,
            payload: { id, response },
          })

          hash = response.hash as string

          addInfoNotification('Transaction pending', manifest.purpose.present, getTxExplorerAttrs(hash, getExplorerUrl))
        })
        .catch(error => {
          dispatch({
            type: Actions.Error,
            payload: { id, error },
          })
          console.error(error)
          addErrorNotification('Transaction failed', manifest.purpose.present, hash ? getTxExplorerAttrs(hash, getExplorerUrl) : undefined)
        })
    },
    [addErrorNotification, addInfoNotification, getExplorerUrl],
  )

  return (
    <dispatchCtx.Provider
      value={useMemo(
        () => ({
          cancel,
          check,
          finalize,
          propose,
          reset,
          send,
        }),
        [reset, cancel, propose, send, finalize, check],
      )}
    >
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  )
}
