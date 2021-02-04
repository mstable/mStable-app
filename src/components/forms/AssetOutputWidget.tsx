import React, { FC, useMemo } from 'react';

import { Widget } from '../core/Widget';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { useTokenSubscription } from '../../context/TokensProvider';
import { ExchangeRate } from '../core/ExchangeRate';

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
        (inputToken || inputLabel) &&
        (outputToken || outputLabel) && (
          <ExchangeRate
            inputToken={inputToken}
            outputToken={outputToken}
            inputLabel={inputLabel}
            outputLabel={outputLabel}
            exchangeRate={exchangeRate}
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
