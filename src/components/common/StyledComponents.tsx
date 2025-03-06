import styled from 'styled-components';

// Layout Components
export const Container = styled.div`
  max-width: ${props => props.theme.layout.maxWidth};
  padding: ${props => props.theme.layout.containerPadding};
  margin: 0 auto;
`;

export const Card = styled.div`
  background: ${props => props.theme.components.card.background};
  border: 1px solid ${props => props.theme.components.card.border};
  box-shadow: ${props => props.theme.components.card.shadow};
  border-radius: ${props => props.theme.layout.borderRadius.md};
  padding: ${props => props.theme.layout.spacing.lg};
`;

// Form Components
export const Input = styled.input`
  height: ${props => props.theme.components.input.height};
  padding: 0 ${props => props.theme.layout.spacing.md};
  border: 1px solid ${props => props.theme.components.input.border};
  border-radius: ${props => props.theme.layout.borderRadius.md};
  background: ${props => props.theme.components.input.background};
  
  &:focus {
    border-color: ${props => props.theme.components.input.focusBorder};
    outline: none;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  height: ${props => props.theme.components.button.height};
  padding: 0 ${props => props.theme.components.button.padding};
  border-radius: ${props => props.theme.components.button.borderRadius};
  font-weight: ${props => props.theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s;

  ${props => {
    const buttonTheme = props.theme.components.button;
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${buttonTheme.secondary.background};
          color: ${buttonTheme.secondary.color};
          border: none;
          &:hover { background: ${buttonTheme.secondary.hoverBg}; }
        `;
      case 'outline':
        return `
          background: transparent;
          border: 1px solid ${buttonTheme.outline.border};
          color: ${buttonTheme.outline.color};
          &:hover { background: ${buttonTheme.outline.hoverBg}; }
        `;
      default:
        return `
          background: ${buttonTheme.primary.background};
          color: ${buttonTheme.primary.color};
          border: 1px solid ${buttonTheme.primary.border};
          &:hover { 
            background: ${buttonTheme.primary.hoverBg};
            border-color: ${props.theme.secondary.dark};
          }
        `;
    }
  }}
`;

// Table Components
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    background: ${props => props.theme.components.table.headerBg};
    padding: ${props => props.theme.layout.spacing.md};
    text-align: left;
    font-weight: ${props => props.theme.typography.weights.semibold};
  }
  
  td {
    padding: ${props => props.theme.layout.spacing.md};
    border-bottom: 1px solid ${props => props.theme.components.table.borderColor};
  }
  
  tbody tr:hover {
    background: ${props => props.theme.components.table.hoverBg};
  }
`;