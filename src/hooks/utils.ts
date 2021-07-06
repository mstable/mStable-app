import { Context, createElement, ReactElement, ReactNode, useContext } from 'react'

export const providerFactory = <T>(context: Context<T>, props: { value: T }, children: ReactNode): ReactElement =>
  createElement(context.Provider, props, children)

export const createUseContextFn = <T>(context: Context<T>, checkNull?: boolean) => (): T => {
  const value = useContext(context)

  if (checkNull && value == null) {
    throw new Error(`${context.displayName} must be used inside a ${context.Provider.name}.`)
  }

  return value
}
