import React, { FC, FormEvent, useCallback } from 'react';
import styled from 'styled-components';
import {
  useToggleWallet,
  useIsSupportedChain,
  useIsWalletConnected,
} from '../../context/AppProvider';
import { FontSize } from '../../theme';
import { Button } from './Button';

interface Props {
  onSubmit?(event: FormEvent<Element>): void;
  error?: string;
  submitting?: boolean;
}

const StyledForm = styled.form<{ disabled?: boolean; submitting?: boolean }>`
  cursor: ${({ disabled, submitting }) =>
    disabled || submitting ? 'not-allowed' : 'auto'};

  input,
  select,
  textarea,
  button {
    pointer-events: ${({ disabled, submitting }) =>
      disabled || submitting ? 'none' : 'auto'};
  }
`;

const FormError = styled.div`
  color: ${({ theme }) => theme.color.red};
`;

export const Form: FC<Props> = ({ children, onSubmit, error, submitting }) => {
  const connected = useIsWalletConnected();
  const supportedChain = useIsSupportedChain();
  const disabled = !connected;
  const openWallet = useToggleWallet();

  const handleClick = useCallback(() => {
    // If not connected on a supported chain, forms should start
    // the wallet connection
    if (!(connected && supportedChain)) {
      openWallet();
    }
  }, [connected, openWallet, supportedChain]);

  return (
    <StyledForm
      onClick={handleClick}
      onSubmit={onSubmit}
      disabled={disabled}
      submitting={submitting}
    >
      {error ? <FormError>{error}</FormError> : null}
      <div>{children}</div>
    </StyledForm>
  );
};

export const FormRow = styled.div`
  width: 100%;
  padding-bottom: 16px;
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
  padding-top: 16px;
  padding-bottom: 16px;
  text-transform: uppercase;
  box-shadow: ${({ theme, disabled }) =>
      disabled ? theme.color.blackTransparenter : theme.color.greenTransparent}
    0 10px 20px;
  transition: background-color 0.4s ease;
  font-size: ${FontSize.l};

  &:hover {
    ${({ theme, disabled }) =>
      disabled ? '' : `background: ${theme.color.coolMint}`}
  }
`;
