import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.background.default};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  color: #ff7a00;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: 300px;

  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    padding: 0.25rem 0;
    font-size: 0.95rem;

    &::placeholder {
      color: #9ca3af;
    }
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #ff7a00;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #e66d00;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    color: #4b5563;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    color: #4b5563;
  }
`; 