import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme } from '../styles/theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StyledThemeProvider theme={lightTheme}>
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider; 