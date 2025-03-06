import { createGlobalStyle } from 'styled-components';
import { lightTheme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${lightTheme.typography.fontFamily};
    background-color: ${lightTheme.background.default};
    color: ${lightTheme.text.primary};
    
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${lightTheme.typography.weights.semibold};
    margin-bottom: ${lightTheme.layout.spacing.md};
  }

  h1 { font-size: ${lightTheme.typography.sizes.h1}; }
  h2 { font-size: ${lightTheme.typography.sizes.h2}; }
  h3 { font-size: ${lightTheme.typography.sizes.h3}; }

  a {
    color: ${lightTheme.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`; 