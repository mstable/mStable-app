import React, { FC } from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';

import { theme } from '../theme';

export const ThemeProvider: FC = ({ children }) => {
  return (
    <StyledComponentsThemeProvider theme={theme}>
      {children}
    </StyledComponentsThemeProvider>
  );
};
