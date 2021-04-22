import React, { FC } from 'react'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import { lightTheme, darkTheme } from '../theme'
import { useThemeMode } from './AppProvider'

export const ThemeProvider: FC = ({ children }) => {
  const themeMode = useThemeMode()
  return <StyledComponentsThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>{children}</StyledComponentsThemeProvider>
}
