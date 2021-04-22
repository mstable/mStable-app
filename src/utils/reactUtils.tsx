import type { FC, ReactElement, ReactNode } from 'react'
import React from 'react'

export const composeComponents = (components: FC[], subComponent: ReactElement | ReactNode): ReactElement =>
  components.reverse().reduce((prev, Component) => <Component>{prev}</Component>, subComponent) as ReactElement

export const composedComponent = (...components: FC[]): FC => ({ children }) => composeComponents(components, children)
