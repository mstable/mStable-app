import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '../core/Button';
import { SubscribedTokenInput } from './SubscribedTokenInput';
import { AmountInputV2 as InputField } from './AmountInputV2';
import { ApproveContent } from './SendButton';
import { ReactComponent as LockIcon } from '../icons/lock-open.svg';
import { ReactComponent as UnlockedIcon } from '../icons/lock-closed.svg';
import { ApproveProvider, Mode, useApprove } from './ApproveProvider';
import type { AddressOption } from '../../types';
import { ViewportWidth } from '../../theme';

interface Props {
  disabled?: boolean;
  amountDisabled?: boolean;
  formValue?: string;
  address?: string;
  addressOptions?: (AddressOption | string)[];
  addressDisabled?: boolean;
  error?: 'warning' | 'error';
  handleSetAmount?(formValue?: string): void;
  handleSetAddress?(address: string): void;
  handleSetMax?(): void;
  needsApprove?: boolean;
  handleApprove?: (mode: Mode) => void;
  spender?: string;
}

const Input = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;

  button {
    align-self: center;
    border-radius: 0.5rem;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.body};
    border: 1px solid ${({ theme }) => theme.color.accent};
  }
`;

const LockButton = styled(Button)`
  border-radius: 0.5rem;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const MaxButton = styled(Button)`
  display: none;

  @media (min-width: ${ViewportWidth.m}) {
    display: inherit;
  }
`;

const Approve = styled(ApproveContent)`
  margin-right: 0.5rem;
`;

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > div {
    margin-right: 1rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.4s ease;
  margin-right: 1rem;

  > :last-child {
    margin-right: 0;
    flex: 1;
  }

  input {
    margin-bottom: 0;
    height: 100%;
    flex: 1;
  }
`;

const Container = styled.div<{
  error?: 'warning' | 'error';
  disabled: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid
    ${({ theme, error }) =>
      error === 'warning'
        ? '#F4C886'
        : error === 'error'
        ? theme.color.red
        : theme.color.accent};
  border-radius: 0.75rem;
  padding: 0.5rem;
  background: ${({ theme, disabled }) =>
    disabled && theme.color.backgroundAccent};
  height: 4.25rem;

  &:focus-within {
    border-color: ${({ theme, disabled }) =>
      disabled ? 'transparent' : theme.color.primary};
  }

  ${InputContainer} {
    flex: 1;
  }
`;

const AssetInputContent: FC<Props> = ({
  disabled,
  address,
  addressDisabled,
  addressOptions,
  amountDisabled,
  error,
  formValue,
  handleSetAddress,
  handleSetAmount,
  handleSetMax,
  needsApprove,
  handleApprove,
  spender,
}) => {
  const [unlockState, setUnlockState] = useState(false);

  const handleUnlockClick = useCallback(() => {
    setUnlockState(true);
  }, []);

  useEffect(() => {
    if (needsApprove) return;
    setUnlockState(false);
  }, [needsApprove]);

  return (
    <Container error={error} disabled={disabled ?? false}>
      {needsApprove && unlockState && handleApprove ? (
        <Approve
          mode="exact"
          onCloseClick={() => setUnlockState(false)}
          onApproveClick={handleApprove}
          hasPendingApproval={false}
        />
      ) : (
        <>
          <InputContainer>
            <Input>
              <InputField
                disabled={amountDisabled}
                value={formValue}
                onChange={handleSetAmount}
                step="any"
              />
              {handleSetMax && (
                <MaxButton
                  type="button"
                  onClick={handleSetMax}
                  scale={0.75}
                  transparent
                >
                  Max
                </MaxButton>
              )}
            </Input>
          </InputContainer>
          <TokenContainer>
            <SubscribedTokenInput
              disabled={addressDisabled}
              value={address}
              options={addressOptions}
              onChange={handleSetAddress}
            />
            {spender && (
              <LockButton
                scale={0.875}
                highlighted={needsApprove}
                transparent={!needsApprove}
                disabled={!needsApprove}
                onClick={handleUnlockClick}
              >
                {needsApprove ? <UnlockedIcon /> : <LockIcon />}
              </LockButton>
            )}
          </TokenContainer>
        </>
      )}
    </Container>
  );
};

const AssetInputApproveContent: FC<Props> = ({
  address,
  addressDisabled,
  addressOptions,
  amountDisabled,
  children,
  disabled,
  error,
  formValue,
  handleSetAddress,
  handleSetAmount,
  handleSetMax,
  spender,
}) => {
  const [{ needsApprove }, handleApprove] = useApprove();
  return (
    <AssetInputContent
      address={address}
      addressDisabled={addressDisabled}
      addressOptions={addressOptions}
      amountDisabled={amountDisabled}
      children={children}
      disabled={disabled}
      error={error}
      formValue={formValue}
      handleApprove={handleApprove}
      handleSetAddress={handleSetAddress}
      handleSetAmount={handleSetAmount}
      handleSetMax={handleSetMax}
      needsApprove={needsApprove}
      spender={spender}
    />
  );
};

export const AssetInput: FC<Props> = ({
  address,
  spender,
  formValue,
  addressOptions,
  error,
  handleSetAddress,
  disabled,
  handleSetAmount,
  children,
  needsApprove,
  amountDisabled,
  handleSetMax,
  handleApprove,
  addressDisabled,
}) => {
  return spender && address ? (
    <ApproveProvider address={address} spender={spender}>
      <AssetInputApproveContent
        address={address}
        spender={spender}
        formValue={formValue}
        addressOptions={addressOptions}
        error={error}
        handleSetAddress={handleSetAddress}
        disabled={disabled}
        handleSetAmount={handleSetAmount}
        children={children}
        needsApprove={needsApprove}
        amountDisabled={amountDisabled}
        handleSetMax={handleSetMax}
        handleApprove={handleApprove}
        addressDisabled={addressDisabled}
      />
    </ApproveProvider>
  ) : (
    <AssetInputContent
      address={address}
      spender={spender}
      formValue={formValue}
      addressOptions={addressOptions}
      error={error}
      handleSetAddress={handleSetAddress}
      disabled={disabled}
      handleSetAmount={handleSetAmount}
      children={children}
      needsApprove={needsApprove}
      amountDisabled={amountDisabled}
      handleSetMax={handleSetMax}
      handleApprove={handleApprove}
      addressDisabled={addressDisabled}
    />
  );
};
