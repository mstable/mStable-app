import React, { FC, FormEvent, useCallback } from 'react';
import styled from 'styled-components';
import {
  useExpandWallet,
  useIsWalletConnected,
} from '../../context/AppProvider';
import { Button } from './Button';

interface Props {
  onSubmit?(event: FormEvent<Element>): void;
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

export const FormRow = styled.div`
  width: 100%;
  padding-bottom: 40px;
  ${({ theme }) => theme.mixins.borderTop}
`;

export const SubmitButton = styled(Button)`
  color: ${({ theme, disabled }) =>
    disabled ? theme.color.blackTransparent : theme.color.white};
  border-color: ${({ theme, disabled }) =>
    disabled ? theme.color.blackTransparent : theme.color.greenTransparent};
  background: ${({ theme, disabled }) =>
    disabled ? 'initial' : theme.color.green};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.m};
  line-height: 2.5rem;
  text-transform: uppercase;
  box-shadow: ${({ theme, disabled }) =>
      disabled ? theme.color.blackTransparenter : theme.color.greenTransparent}
    0 10px 20px;
  transition: background-color 0.4s ease;

  &:hover {
    ${({ theme, disabled }) =>
      disabled ? '' : `background: ${theme.color.coolMint}`}
  }
`;
