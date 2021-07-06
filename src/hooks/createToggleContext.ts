import { FC, createContext, Context } from 'react'
import { useToggle } from 'react-use'

import { createUseContextFn, providerFactory } from './utils'

type State = [boolean, () => void]

export const createToggleContext = (
  defaultInitialValue = false,
): Readonly<[() => State, FC<{ initialValue?: boolean }>, Context<State>]> => {
  const context = createContext<State>(undefined as never)

  const ToggleProvider: FC<{ initialValue?: boolean }> = ({ children, initialValue }) => {
    const state = useToggle(initialValue !== undefined ? initialValue : defaultInitialValue)
    return providerFactory(context, { value: state }, children)
  }

  return [createUseContextFn(context, true), ToggleProvider, context] as const
}
