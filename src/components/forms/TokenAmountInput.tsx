import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { AmountInput } from './AmountInput';
import { TokenInput } from './TokenInput';
import {
  TokenDetailsFragment,
  useErc20TokensQuery,
} from '../../graphql/generated';
import { Size } from '../../theme';
import { Button } from '../core/Button';

interface Props {
  name: string;
  error?: string;
  tokenValue: string | null;
  amountValue: string | void;
  tokenAddresses: string[];
  needsUnlock?: boolean;
  balance?: string | null;
  onUnlock?(): void;
  onChangeAmount?(name: string, simpleAmount: string | null): void;
  onChangeToken?(name: string, token: TokenDetailsFragment): void;
  onSetMax?(): void;
}

const Container = styled.div``;

const UnlockButton = styled(Button)`
  background: transparent;
  height: 36px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${props => props.theme.spacing.s};

  > :last-child {
    margin-left: ${props => props.theme.spacing.s};
  }
`;

const Error = styled.div`
  color: ${props => props.theme.color.red};
`;

const Balance = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
  text-transform: uppercase;
`;

/**
 * TokenAmountInput
 * Select a token and an amount denominated in that token.
 *
 * @param name @TODO
 * @param needsUnlock @TODO
 * @param onUnlock @TODO
 * @param balance @TODO
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenAddresses,
  tokenValue,
  amountValue,
  name,
  needsUnlock,
  balance,
  onUnlock,
  onChangeAmount,
  onChangeToken,
  onSetMax,
}) => {
  const { data: tokensData } = useErc20TokensQuery({
    variables: { addresses: tokenAddresses },
  });
  const selectedToken = useMemo(
    () => tokensData?.tokens.find(t => t.address === tokenValue),
    [tokensData, tokenValue],
  );
  return (
    <Container>
      <InputContainer>
        <AmountInput
          name={name}
          value={amountValue}
          onChange={onChangeAmount}
          onSetMax={onSetMax}
          error={error}
          decimals={selectedToken?.decimals}
        />
        {needsUnlock && onUnlock ? (
          <UnlockButton type="button" onClick={onUnlock} size={Size.m}>
            Unlock
          </UnlockButton>
        ) : null}
        <TokenInput
          name={name}
          value={tokenValue}
          tokens={tokensData?.tokens || []}
          onChange={onChangeToken}
        />
      </InputContainer>
      {balance ? <Balance>Balance: {balance}</Balance> : null}
      {error ? <Error>{error}</Error> : null}
    </Container>
  );
};
