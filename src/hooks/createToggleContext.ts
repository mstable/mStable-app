import { FC, createElement, createContext, useContext, ReactElement, ReactChildren, Context } from 'react'
import { useToggle } from 'react-use'

type State = [boolean, () => void]

export const createToggleContext = (
  defaultInitialValue = false,
): Readonly<[() => State, FC<{ initialValue?: boolean }>, Context<State>]> => {
  const context = createContext<State>(undefined as never)

  const providerFactory = (props: { value: State }, children: ReactChildren): ReactElement =>
    createElement(context.Provider, props, children)

  const ToggleProvider: FC<{ initialValue?: boolean }> = ({ children, initialValue }) => {
    const state = useToggle(initialValue !== undefined ? initialValue : defaultInitialValue)
    return providerFactory({ value: state }, children as ReactChildren)
  }

  const useToggleContext = (): State => {
    const state = useContext(context)
    if (state == null) {
      throw new Error(`useToggleContext must be used inside a ToggleProvider.`)
    }
    return state
  }

  return [useToggleContext, ToggleProvider, context] as const
}
