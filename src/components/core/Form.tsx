import React, { FC, FormEvent, useCallback } from 'react';
import styled from 'styled-components';
import {
  useExpandWallet,
  useIsWalletConnected,
} from '../../context/AppProvider';

export const StyledForm = styled.form<{ disabled?: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  input,
  select,
  textarea,
  button {
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  }
`;

export const Form: FC<{ onSubmit(event: FormEvent<Element>): void }> = ({
  children,
  onSubmit,
}) => {
  const connected = useIsWalletConnected();
  const expandWallet = useExpandWallet();

  const handleClick = useCallback(() => {
    // If not connected, forms should start the wallet connection
    if (!connected) {
      expandWallet();
    }
  }, [connected, expandWallet]);

  return (
    <StyledForm onClick={handleClick} onSubmit={onSubmit} disabled={!connected}>
      {children}
    </StyledForm>
  );
};

export const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.xl};

  > * {
    flex: 1;
    margin-right: ${props => props.theme.spacing.l};
    width: 100%;
    &:last-child {
      margin-right: 0;
    }
  }
`;
