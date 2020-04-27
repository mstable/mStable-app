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
import { FlexRow } from '../core/Containers';

interface Props {
  name: string;
  error?: string;
  tokenValue: string | null;
  amountValue: string | null;
  tokenAddresses: string[];
  needsUnlock?: boolean;
  items?: { label: string; value?: string | null | undefined }[];
  onUnlock?(): void;
  onChangeAmount?(name: string, simpleAmount: string | null): void;
  onChangeToken?(name: string, token: TokenDetailsFragment): void;
  onSetMax?(): void;
}

const InputsRow = styled(FlexRow)`
  align-items: flex-start;
  margin-bottom: 0;
`;

const Error = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.color.red};
  font-size: ${({ theme }) => theme.fontSize.s};
  min-height: 2rem;
`;

const Item = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const ItemValue = styled.div``;

const ItemLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
  text-transform: uppercase;
  font-weight: bold;
`;

const AmountInputContainer = styled.div`
  width: 100%;
`;

/**
 * TokenAmountInput
 * Select a token and an amount denominated in that token.
 *
 * @param name @TODO
 * @param needsUnlock @TODO
 * @param onUnlock @TODO
 * @param items @TODO
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
  onUnlock,
  onChangeAmount,
  onChangeToken,
  onSetMax,
  items = [],
}) => {
  const { data: tokensData } = useErc20TokensQuery({
    variables: { addresses: tokenAddresses },
    skip: tokenAddresses.length === 0,
  });
  const selectedToken = useMemo(
    () => tokensData?.tokens.find(t => t.address === tokenValue),
    [tokensData, tokenValue],
  );
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
            decimals={selectedToken?.decimals || null}
          />
          <FlexRow size={Size.xs}>
            <div>
              {items.map(({ label, value }) => (
                <Item key={label}>
                  <ItemLabel>{label}</ItemLabel>
                  <ItemValue>{value || '—'}</ItemValue>
                </Item>
              ))}
            </div>
            <FlexRow size={Size.xs}>
              {onSetMax ? (
                <Button type="button" onClick={onSetMax} size={Size.xs}>
                  Set maximum
                </Button>
              ) : null}
              {needsUnlock && onUnlock ? (
                <Button type="button" onClick={onUnlock} size={Size.xs}>
                  Unlock
                </Button>
              ) : null}
            </FlexRow>
          </FlexRow>
        </AmountInputContainer>
        <TokenInput
          name={name}
          value={tokenValue}
          tokens={tokensData?.tokens || []}
          onChange={onChangeToken}
          error={error}
        />
      </InputsRow>
      <Error>{error}</Error>
    </>
  );
};
