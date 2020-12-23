import React, { FC } from 'react';
import styled from 'styled-components';

import { useTokens } from '../../../../context/TokensProvider';
import { ViewportWidth } from '../../../../theme';
import { Fields, Token } from '../../../../types';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { Button } from '../../../core/Button';
import { AmountInput } from '../../../forms/AmountInput';
import { TokenInput } from '../../../forms/TokenInput';

interface Props {
  name: Fields;
  amount: {
    value?: BigDecimal;
    formValue: string | null;
    disabled?: boolean;
    handleChange?(formValue: string | null): void;
    handleClick?(): void;
    handleSetMax?(): void;
  };
  token: {
    address?: string;
    addresses?: string[];
    disabled?: boolean;
    handleChange?(name: string, token: Token | null): void;
  };
  toggle?: {
    canEnable: boolean;
    enabled: boolean;
    reasonCannotEnable?: string;
    handleToggle(): void;
  };
  error?: string;
  valid?: boolean;
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
  valid?: boolean;
  overweight?: boolean;
  enabled?: boolean;
}>`
  background: ${({ theme, overweight }) =>
    overweight ? theme.color.blackTransparenter : theme.color.white};
  margin-bottom: 8px;
`;

// TODO: Might be able to adapt existing rather than fork

export const AssetTokenInput: FC<Props> = ({
  amount,
  token,
  error,
  overweight,
  toggle,
  valid,
  name,
}) => {
  const subscribedTokens = useTokens(token.addresses ?? []);
  const enabled = toggle ? toggle.enabled : true;

  return (
    <Container enabled={enabled} overweight={overweight} valid={valid}>
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
            {amount.handleSetMax ? (
              <Button type="button" onClick={amount.handleSetMax}>
                Max
              </Button>
            ) : null}
          </Input>
        </InputContainer>
        <TokenContainer>
          <TokenInput
            name={name}
            disabled={token.disabled}
            value={token.address ?? null}
            tokens={subscribedTokens}
            onChange={token.handleChange}
          />
        </TokenContainer>
      </Grid>
    </Container>
  );
};
