import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { Widget } from '../core/Widget';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { useTokenSubscription } from '../../context/TokensProvider';

interface Props {
  className?: string;
  exchangeRate?: { value?: BigDecimal; fetching?: boolean };
  inputAddress?: string;
  inputAmount?: BigDecimal;
  inputLabel?: string;
  outputAddress?: string;
  outputBalance?: BigDecimal;
  outputLabel?: string;
  title: string;
}

const ExchangeRate = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.color.grey};

  span {
    ${({ theme }) => theme.mixins.numeric};
  }
`;

export const AssetOutputWidget: FC<Props> = ({
  className,
  exchangeRate,
  inputAddress,
  inputAmount,
  inputLabel,
  outputAddress,
  outputBalance,
  outputLabel,
  title,
}) => {
  const outputAmount =
    inputAmount && exchangeRate?.value
      ? inputAmount.mulTruncate(exchangeRate.value.exact)
      : inputAmount;

  const inputToken = useTokenSubscription(inputAddress);
  const outputToken = useTokenSubscription(outputAddress);

  const addressOptions = useMemo(
    () =>
      outputAddress
        ? [
            {
              address: outputAddress,
              balance: outputBalance,
              label: outputLabel,
            },
          ]
        : [],
    [outputAddress, outputBalance, outputLabel],
  );

  return (
    <Widget
      className={className}
      title={title}
      border
      boldTitle
      headerContent={
        exchangeRate &&
        (inputToken || inputLabel) &&
        (outputToken || outputLabel) && (
          <ExchangeRate>
            {exchangeRate.fetching && <Skeleton height={16} width={150} />}
            {exchangeRate.value && (
              <>
                <span>1</span>
                {` `}
                {inputLabel ?? inputToken?.symbol}
                <span> ≈ {exchangeRate.value.format(6)}</span>
                {` ${outputLabel ?? outputToken?.symbol}`}
              </>
            )}
          </ExchangeRate>
        )
      }
    >
      <AssetInput
        formValue={outputAmount?.string}
        amountDisabled
        addressDisabled
        address={outputAddress}
        addressOptions={addressOptions}
      />
    </Widget>
  );
};
