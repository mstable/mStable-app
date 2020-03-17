import React, { FC, useMemo } from 'react';
import { AmountInput } from './AmountInput';
import { TokenInput } from './TokenInput';
import { useErc20TokensQuery } from '../../graphql/generated';

interface Props {
  error?: string;
  tokenValue: string | null;
  amountValue: string | void;
  tokenAddresses: string[];
  onChangeAmount?(amount: string): void;
  onChangeToken?(token: string): void;
  onSetMax?(): void;
}

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
  tokenAddresses,
  tokenValue,
  amountValue,
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
    <>
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
      <div>{error}</div>
    </>
  );
};
