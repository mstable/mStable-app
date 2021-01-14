import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { Widget } from '../core/Widget';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { useTokenSubscription } from '../../context/TokensProvider';

interface Props {
  className?: string;
  exchangeRate?: BigDecimal;
  inputAddress?: string;
  inputAmount?: BigDecimal;
  outputAddress?: string;
  outputBalance?: BigDecimal;
  outputLabel?: string;
  title: string;
}

const ExchangeRate = styled.p`
  font-size: 0.875rem;
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
  outputAddress,
  outputBalance,
  outputLabel,
  title,
}) => {
  const outputAmount =
    inputAmount && exchangeRate
      ? inputAmount.mulTruncate(exchangeRate.exact)
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
        inputToken &&
        (outputToken || outputLabel) && (
          <ExchangeRate>
            <span>1</span>
            {` `}
            {inputToken.symbol}
            <span> = {exchangeRate?.format(4)}</span>
            {` ${outputLabel ?? outputToken?.symbol}`}
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
