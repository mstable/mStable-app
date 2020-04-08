import React, { FC, FormEvent } from 'react';
import styled from 'styled-components';
import { useIsWalletConnected } from '../../context/AppProvider';

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
  return (
    <StyledForm onSubmit={onSubmit} disabled={!connected}>
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
