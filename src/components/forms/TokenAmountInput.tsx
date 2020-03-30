import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { AmountInput } from './AmountInput';
import { TokenInput } from './TokenInput';
import {
  TokenDetailsFragment,
  // useErc20TokensQuery,
} from '../../graphql/generated';

interface Props {
  error?: string;
  tokenValue: string | null;
  amountValue: string | void;
  tokenAddresses: string[];
  onChangeAmount?(amount: string): void;
  onChangeToken?(token: string): void;
  onSetMax?(): void;
}

const Container = styled.div``;

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

/**
 * TokenAmountInput
 * Select a token and an amount denominated in that token.
 *
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
  onChangeAmount,
  onChangeToken,
  onSetMax,
}) => {
  // TODO remove fake data
  // const { data: tokensData } = useErc20TokensQuery({
  //   variables: { addresses: tokenAddresses },
  // });
  const tokensData: { tokens: TokenDetailsFragment[] } = {
    tokens: [
      { address: '0x1', symbol: 'mUSD', decimals: 18, totalSupply: '0' },
    ],
  };
  const selectedToken = useMemo(
    () => tokensData?.tokens.find(t => t.address === tokenValue),
    [tokensData, tokenValue],
  );
  return (
    <Container>
      <InputContainer>
        <AmountInput
          error={error}
          value={amountValue}
          onChange={onChangeAmount}
          onSetMax={onSetMax}
          decimals={selectedToken?.decimals}
        />
        <TokenInput
          value={tokenValue}
          tokens={tokensData?.tokens || []}
          onChange={onChangeToken}
        />
      </InputContainer>
       {error ? <Error>{error}</Error> : null}
    </Container>
  );
};
