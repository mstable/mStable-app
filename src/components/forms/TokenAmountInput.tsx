import React, { FC } from 'react';
import styled from 'styled-components';

import { Fields, Token } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import { Button } from '../core/Button';
import { AmountInput } from './AmountInput';
import { TokenInput } from './TokenInput';
import { ApproveButton } from './ApproveButton';
import {
  useTokenSubscription,
  useTokenAllowance,
  useTokens,
} from '../../context/TokensProvider';

interface Props {
  name: string;
  error?: string;
  errorLabel?: string;
  tokenValue?: string;
  amountValue?: string;
  tokenAddresses: string[];
  tokenDisabled?: boolean;
  amountDisabled?: boolean;
  exactDecimals?: boolean;
  needsUnlock?: boolean;
  items?: {
    label: string;
    value?: string | null | undefined;
    highlight?: boolean;
  }[];
  onChangeAmount?(formValue?: string): void;
  onChangeToken?(name: Fields, token: Token): void;
  onSetMax?(): void;
  spender?: string;
  approveAmount?: BigDecimal;
  showBalance?: boolean;
}

const Error = styled.div`
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

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  > * {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  > :last-child {
    margin-right: 0;
  }
`;

const InputsRow = styled.div`
  width: 100%;
`;

/**
 * TokenAmountInput
 * Select a token and an amount denominated in that token.
 * @deprecated
 */
export const TokenAmountInput: FC<Props> = ({
  error,
  errorLabel,
  tokenAddresses,
  tokenValue,
  amountValue,
  name,
  exactDecimals,
  tokenDisabled,
  amountDisabled,
  needsUnlock,
  spender,
  onChangeAmount,
  onChangeToken,
  onSetMax,
  approveAmount,
  items = [],
  showBalance = true,
}) => {
  const tokens = useTokens(tokenAddresses);
  const token = useTokenSubscription(tokenValue);
  useTokenAllowance(tokenValue, spender);

  return (
    <>
      <InputsRow>
        <InputContainer>
          <AmountInput
            value={amountValue}
            disabled={amountDisabled}
            onChange={onChangeAmount}
            error={!!error}
          />
          {onSetMax ? (
            <Button type="button" onClick={onSetMax}>
              Max
            </Button>
          ) : null}
          <TokenInput
            name={name}
            disabled={tokenDisabled}
            value={tokenValue}
            tokens={tokens}
            onChange={onChangeToken}
            error={error}
          />
        </InputContainer>
        {needsUnlock && tokenValue && spender && approveAmount ? (
          <ApproveButton
            address={tokenValue}
            spender={spender}
            amount={approveAmount}
          />
        ) : null}
      </InputsRow>
      <div>
        {showBalance && (
          <Items>
            <Item key="balance">
              <ItemLabel>Balance</ItemLabel>
              <div>
                {token
                  ? token.balance.format(
                      exactDecimals ? token.decimals : 2,
                      true,
                      token.symbol,
                    )
                  : '—'}
              </div>
            </Item>
            {items.map(({ label, value, highlight }) => (
              <Item key={label} highlight={highlight}>
                <ItemLabel>{label}</ItemLabel>
                <div>{value || '—'}</div>
              </Item>
            ))}
          </Items>
        )}
        <Error>
          {error && errorLabel ? <ErrorLabel>{errorLabel}</ErrorLabel> : null}
          <div>{error}</div>
        </Error>
      </div>
    </>
  );
};
