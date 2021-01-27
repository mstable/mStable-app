import React, { FC, useMemo } from 'react';

import { useTokenSubscription } from '../../context/TokensProvider';
import { Widget } from '../core/Widget';
import { BigDecimal } from '../../web3/BigDecimal';

import { AssetInput } from './AssetInput';
import { ExchangeRate } from './ExchangeRate';

interface Props {
  className?: string;
  exchangeRate?: { value?: BigDecimal; fetching?: boolean };
  inputAddress?: string;
  inputAmount?: BigDecimal;
  inputLabel?: string;
  outputAddress?: string;
  outputBalance?: BigDecimal;
  outputLabel?: string;
  title?: string;
}

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
      boldTitle
      headerContent={
        exchangeRate &&
        (inputToken || inputLabel) &&
        (outputToken || outputLabel) && (
          <ExchangeRate
            exchangeRate={exchangeRate}
            outputLabel={outputLabel}
            inputLabel={inputLabel}
            inputToken={inputToken}
            outputToken={outputToken}
          />
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
