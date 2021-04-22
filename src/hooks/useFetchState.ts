import { useMemo, useState } from 'react'

export interface FetchState<T> {
  fetching?: boolean
  value?: T
  error?: string
}

interface FetchStateCallbacks<T> {
  value(value?: T): void
  error(error: string): void
  fetching(): void
}

export const useFetchState = <T>(initialState: FetchState<T> = {}): [FetchState<T>, FetchStateCallbacks<T>] => {
  const [fetchState, setFetchState] = useState<FetchState<T>>(initialState)

  const callbacks = useMemo<FetchStateCallbacks<T>>(
    () => ({
      value: value => {
        setFetchState({ value })
      },
      error: error => {
        setFetchState({ error })
      },
      fetching: () => {
        setFetchState({ fetching: true })
      },
    }),
    [setFetchState],
  )

  return [fetchState, callbacks]
}
