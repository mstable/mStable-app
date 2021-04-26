import React, { FC, createContext, useContext, useCallback, useMemo, useReducer, Reducer, useEffect, ReactNode } from 'react'

import { LocalStorage } from '../localStorage'

export interface BannerMessage {
  title: string
  subtitle?: ReactNode
  emoji: string
  url?: string
}

export type ThemeMode = 'light' | 'dark'

enum Actions {
  SetOnline,
  ToggleAccount,
  CloseAccount,
  SetBannerMessage,
  SetThemeMode,
}

interface State {
  error: string | null
  accountOpen: boolean
  online: boolean
  bannerMessage?: BannerMessage
  themeMode: ThemeMode
}

type Action =
  | { type: Actions.ToggleAccount }
  | { type: Actions.CloseAccount }
  | { type: Actions.SetOnline; payload: boolean }
  | { type: Actions.SetThemeMode; payload: ThemeMode | null }
  | { type: Actions.SetBannerMessage; payload?: BannerMessage }

interface Dispatch {
  closeAccount(): void
  toggleWallet(): void
  setBannerMessage(message?: BannerMessage): void
  setThemeMode(mode: ThemeMode): void
  toggleThemeMode(): void
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.ToggleAccount:
      return {
        ...state,
        accountOpen: !state.accountOpen,
      }
    case Actions.CloseAccount:
      return {
        ...state,
        accountOpen: false,
      }
    case Actions.SetOnline:
      return { ...state, online: action.payload }
    case Actions.SetBannerMessage:
      return { ...state, bannerMessage: action.payload }
    case Actions.SetThemeMode: {
      if (action.payload === null) {
        return {
          ...state,
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        }
      }
      return { ...state, themeMode: action.payload ?? 'light' }
    }
    default:
      return state
  }
}

const initialState: State = {
  error: null,
  accountOpen: false,
  online: true,
  themeMode: 'light',
}

const context = createContext<[State, Dispatch]>(null as never)

export const AppProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const themeMode = (LocalStorage.get('themeMode') as ThemeMode) ?? 'light'
    dispatch({ type: Actions.SetThemeMode, payload: themeMode })
  }, [])

  const setBannerMessage = useCallback<Dispatch['setBannerMessage']>(
    message => {
      dispatch({
        type: Actions.SetBannerMessage,
        payload: message,
      })
    },
    [dispatch],
  )

  const setThemeMode = useCallback<Dispatch['setThemeMode']>(
    mode => {
      dispatch({
        type: Actions.SetThemeMode,
        payload: mode,
      })
    },
    [dispatch],
  )

  const toggleThemeMode = useCallback<Dispatch['toggleThemeMode']>(() => {
    dispatch({
      type: Actions.SetThemeMode,
      payload: null,
    })
  }, [dispatch])

  const closeAccount = useCallback<Dispatch['closeAccount']>(() => {
    dispatch({ type: Actions.CloseAccount })
  }, [dispatch])

  const toggleWallet = useCallback<Dispatch['toggleWallet']>(() => {
    dispatch({ type: Actions.ToggleAccount })
  }, [dispatch])

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            closeAccount,
            setBannerMessage,
            toggleWallet,
            setThemeMode,
            toggleThemeMode,
          },
        ],
        [state, closeAccount, setBannerMessage, toggleWallet, setThemeMode, toggleThemeMode],
      )}
    >
      {children}
    </context.Provider>
  )
}

export const useAppContext = (): [State, Dispatch] => useContext(context)

export const useAppState = (): State => useAppContext()[0]

export const useAccountOpen = (): boolean => useAppState().accountOpen

export const useAppDispatch = (): Dispatch => useAppContext()[1]

export const useCloseAccount = (): Dispatch['closeAccount'] => useAppDispatch().closeAccount

export const useToggleWallet = (): Dispatch['toggleWallet'] => useAppDispatch().toggleWallet

export const useBannerMessage = (): [State['bannerMessage'], Dispatch['setBannerMessage']] => [
  useAppState().bannerMessage,
  useAppDispatch().setBannerMessage,
]

export const useSetBannerMessage = (): Dispatch['setBannerMessage'] => useAppDispatch().setBannerMessage

export const useThemeMode = (): State['themeMode'] => useAppState().themeMode

export const useToggleThemeMode = (): Dispatch['toggleThemeMode'] => useAppDispatch().toggleThemeMode

export const useTheme = (): [State['themeMode'], Dispatch['setThemeMode']] => [useAppState().themeMode, useAppDispatch().setThemeMode]
