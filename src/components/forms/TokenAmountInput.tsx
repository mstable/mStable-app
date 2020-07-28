import React, { FC } from 'react';
import styled from 'styled-components';

import {
  TokenDetailsFragment,
  useErc20TokensQuery,
} from '../../graphql/mstable';
import { BigDecimal } from '../../web3/BigDecimal';
import { Size, ViewportWidth } from '../../theme';
import { Button } from '../core/Button';
import { FlexRow } from '../core/Containers';
import { AmountInput } from './AmountInput';
import { TokenInput } from './TokenInput';
import { ApproveButton } from './ApproveButton';
import {
  useToken,
  useTokenAllowance,
} from '../../context/DataProvider/TokensProvider';

interface Props {
  name: string;
  error?: string;
  errorLabel?: string;
  tokenValue: string | null;
  amountValue: string | null;
  tokenAddresses: string[];
  tokenDisabled?: boolean;
  needsUnlock?: boolean;
  items?: {
    label: string;
    value?: string | null | undefined;
    highlight?: boolean;
  }[];
  onChangeAmount?(name: string, simpleAmount: string | null): void;
  onChangeToken?(name: string, token: TokenDetailsFragment): void;
  onSetMax?(): void;
  spender?: string;
  approveAmount?: BigDecimal;
}

const InputsRow = styled(FlexRow)`
  align-items: flex-start;
  margin-bottom: 8px;
`;

const Error = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.color.red};
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const ErrorLabel = styled.div`
  font-weight: bold;
  text-transform: uppercase;
`;

const Items = styled.div`
  > * {
    margin: 8px 0 16px 0;
  }
`;

const ErrorAndItems = styled.div`
  display: flex;
  justify-content: space-between;

  > :first-child {
    margin-right: 16px;
  }

  @media (min-width: ${ViewportWidth.m}) {
    display: block;
    > :first-child {
      margin-right: 0;
    }
    > * {
      margin: 8px 0;
    }
  }
`;

const ItemLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
  text-transform: uppercase;
  font-weight: bold;
`;

const Item = styled.div<{ highlight?: boolean }>`
  ${({ highlight, theme }) =>
    highlight
      ? `
    background: #ffeed2;
    border: 2px ${theme.color.gold} dashed;
    padding: 8px;
    margin-left: -8px;
    margin-right: -8px;
  `
      : ''}
`;

const AmountInputContainer = styled.div`
  width: 100%;
  display: flex;

  input {
    margin-bottom: 0;
  }

  ${Button} {
    white-space: nowrap;
    padding-left: 8px;
    padding-right: 8px;
  }

  > * {
    margin-right: 8px;
  }

  > :last-child {
    margin-right: 0;
  }
`;

/**
 * TokenAmountInput
 * Select a token and an amount denominated in that token.
 *
 * @param name @TODO
 * @param needsUnlock @TODO
 * @param onUnlock @TODO
 * @param items @TODO
 * @param tokenDisabled @TODO
 * @param error Error message, e.g. 'Amount too low'
 * @param tokenAddresses List of available token addresses
 * @param tokenValue Selected token address
 * @param amountValue Chosen amount, e.g. '0.12'
 * @param onChangeAmount Optional callback with the amount value
 * @param onChangeToken Optional callback with the selected token
 * @param onSetMax Optional callback called on setting the max value
 */
export const TokenAmountInput: FC<Props> = ({
  error,
  errorLabel,
  tokenAddresses,
  tokenValue,
  amountValue,
  name,
  tokenDisabled,
  needsUnlock,
  spender,
  onChangeAmount,
  onChangeToken,
  onSetMax,
  approveAmount,
  items = [],
}) => {
  const { data: tokensData } = useErc20TokensQuery({
    variables: { addresses: tokenAddresses },
    skip: tokenAddresses.length === 0,
  });

  const token = useToken(tokenValue);
  useTokenAllowance(tokenValue, spender);

  return (
    <>
      <InputsRow>
        <AmountInputContainer>
          <AmountInput
            name={name}
            value={amountValue}
            onChange={onChangeAmount}
            onSetMax={onSetMax}
            error={error}
          />
          {onSetMax ? (
            <Button type="button" onClick={onSetMax} size={Size.xs}>
              Max
            </Button>
          ) : null}
          {needsUnlock && tokenValue && spender ? (
            <ApproveButton
              address={tokenValue}
              spender={spender}
              amount={approveAmount}
              decimals={token?.decimals}
            />
          ) : null}
        </AmountInputContainer>
        <TokenInput
          name={name}
          disabled={tokenDisabled}
          value={tokenValue}
          tokens={tokensData?.tokens || []}
          onChange={onChangeToken}
          error={error}
        />
      </InputsRow>
      <ErrorAndItems>
        <Items>
          <Item key="balance">
            <ItemLabel>Balance</ItemLabel>
            <div>
              {token ? token.balance.format(2, true, token.symbol) : '—'}
            </div>
          </Item>
          {items.map(({ label, value, highlight }) => (
            <Item key={label} highlight={highlight}>
              <ItemLabel>{label}</ItemLabel>
              <div>{value || '—'}</div>
            </Item>
          ))}
        </Items>
        <Error>
          {error && errorLabel ? <ErrorLabel>{errorLabel}</ErrorLabel> : null}
          <div>{error}</div>
        </Error>
      </ErrorAndItems>
    </>
  );
};
