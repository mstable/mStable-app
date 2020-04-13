import React, { FC, FormEvent, useCallback } from 'react';
import styled from 'styled-components';
import {
  useExpandWallet,
  useIsWalletConnected,
} from '../../context/AppProvider';

interface Props {
  onSubmit(event: FormEvent<Element>): void;
  error?: string;
}

const StyledForm = styled.form<{ disabled?: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  input,
  select,
  textarea,
  button {
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  }
`;

const FormError = styled.div`
  color: ${({ theme }) => theme.color.red};
`;

export const Form: FC<Props> = ({ children, onSubmit, error }) => {
  const connected = useIsWalletConnected();
  const disabled = !connected;
  const expandWallet = useExpandWallet();

  const handleClick = useCallback(() => {
    // If not connected, forms should start the wallet connection
    if (!connected) {
      expandWallet();
    }
  }, [connected, expandWallet]);

  return (
    <StyledForm onClick={handleClick} onSubmit={onSubmit} disabled={disabled}>
      {error ? <FormError>{error}</FormError> : null}
      <div>{children}</div>
    </StyledForm>
  );
};
