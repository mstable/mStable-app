import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { Button } from '../../../core/Button';
import { AmountInput } from '../../../forms/AmountInput';
import { SubscribedTokenInput } from '../../../forms/SubscribedTokenInput';

// TODO: Might be able to adapt existing InlineTokenInput rather than fork

interface Props {
  amount: {
    value?: BigDecimal;
    formValue?: string;
    disabled?: boolean;
    handleChange?(formValue?: string): void;
    handleClick?(): void;
    handleSetMax?(): void;
  };
  token: {
    address?: string;
    options?: { address: string; balance?: BigDecimal; label?: string }[];
    disabled?: boolean;
    handleChange?(tokenAddress?: string): void;
  };
  toggle?: {
    canEnable: boolean;
    enabled: boolean;
    reasonCannotEnable?: string;
    handleToggle(): void;
  };
  error?: string;
  overweight?: boolean;
}

const TokenContainer = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    padding-right: 8px;
  }
`;

const Input = styled.div`
  display: flex;
  justify-content: space-between;

  > * {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }

  button {
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :last-child {
    margin-right: 0;
    flex: 1;
  }

  input {
    margin-bottom: 0;
    height: 100%;
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.m}) {
    align-items: inherit;
  }
`;

const Label = styled.div`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: bold;
  text-transform: uppercase;
  padding-right: 8px;

  @media (min-width: ${ViewportWidth.m}) {
    display: none;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BalanceContainer = styled.div``;

const Grid = styled.div<{ enabled?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;

  ${InputContainer} {
    overflow: hidden;
    transition: all 0.4s ease;
    opacity: ${({ enabled }) => (enabled ? 1 : 0)};
  }

  ${TokenContainer} {
    padding-top: 0.5rem;

    > div {
      flex: 1;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

    ${InputContainer} {
      flex-basis: calc(60% - 0.25rem);
    }

    ${TokenContainer} {
      padding: 0;

      flex-basis: calc(40% - 0.25rem);
    }
  }
`;

const Container = styled.div<{
  overweight?: boolean;
  enabled?: boolean;
}>`
  background: ${({ theme, overweight }) =>
    overweight ? theme.color.blackTransparenter : theme.color.white};
`;

export const AssetTokenInput: FC<Props> = ({
  amount,
  token,
  error,
  overweight,
  toggle,
}) => {
  const enabled = toggle ? toggle.enabled : true;

  return (
    <Container enabled={enabled} overweight={overweight}>
      <Grid enabled={enabled}>
        <InputContainer onClick={amount.handleClick}>
          <Label>Amount</Label>
          <Input>
            <AmountInput
              disabled={amount.disabled}
              value={amount.formValue}
              error={error}
              onChange={amount.handleChange}
            />
            {amount.handleSetMax && (
              <Button type="button" onClick={amount.handleSetMax} scale={0.75}>
                Max
              </Button>
            )}
          </Input>
        </InputContainer>
        <TokenContainer>
          <SubscribedTokenInput
            disabled={token.disabled}
            value={token.address}
            options={token.options}
            onChange={token.handleChange}
          />
        </TokenContainer>
      </Grid>
    </Container>
  );
};
