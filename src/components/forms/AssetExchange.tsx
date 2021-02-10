import React, { FC } from 'react';
import styled from 'styled-components';

import { useTokenSubscription } from '../../context/TokensProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { ExchangeRate } from '../core/ExchangeRate';
import { Arrow } from '../core/Arrow';
import { TransactionOption } from '../../types';
import { ErrorMessage } from '../core/ErrorMessage';

export interface Props {
  className?: string;

  inputAddress?: string;
  inputAddressDisabled?: boolean;
  inputAddressOptions: TransactionOption[];
  inputFormValue?: string;
  handleSetInputAddress?(address?: string): void;
  handleSetInputAmount?(formValue?: string): void;
  handleSetInputMax?(): void;

  outputAddress?: string;
  outputAddressDisabled?: boolean;
  outputAddressOptions: TransactionOption[];
  outputFormValue?: string;
  handleSetOutputAddress?(address?: string): void;
  handleSetOutputAmount?(formValue?: string): void;
  handleSetOutputMax?(): void;

  exchangeRate?: { value?: BigDecimal; fetching?: boolean }; // e.g. for mUSD->imUSD
  error?: string;
}

const Container = styled.div`
  > * {
    margin: 0.5rem 0;
  }
`;

export const AssetExchange: FC<Props> = ({
  inputAddressOptions,
  outputAddressOptions,
  error,
  exchangeRate,
  handleSetInputAddress,
  handleSetInputAmount,
  handleSetInputMax,
  handleSetOutputAddress,
  handleSetOutputAmount,
  handleSetOutputMax,
  inputAddress,
  inputAddressDisabled,
  inputFormValue,
  outputAddress,
  outputAddressDisabled,
  outputFormValue,
  children,
  className,
}) => {
  const inputToken = useTokenSubscription(inputAddress);
  const outputToken = useTokenSubscription(outputAddress);

  const conversionFormValue =
    inputFormValue && exchangeRate?.value && !outputFormValue
      ? BigDecimal.parse(inputFormValue ?? '0')
          .mulTruncate(exchangeRate.value.exact)
          .format(2, false)
      : undefined;

  return (
    <Container className={className}>
      <AssetInput
        address={inputAddress}
        addressOptions={inputAddressOptions}
        formValue={inputFormValue}
        handleSetAmount={handleSetInputAmount}
        handleSetMax={handleSetInputMax}
        handleSetAddress={handleSetInputAddress}
        addressDisabled={inputAddressDisabled}
      />
      <div>
        <Arrow />
        <ExchangeRate
          exchangeRate={exchangeRate}
          outputToken={outputToken}
          inputToken={inputToken}
        />
      </div>
      <AssetInput
        disabled
        address={outputAddress}
        addressOptions={outputAddressOptions}
        formValue={conversionFormValue ?? outputFormValue}
        amountDisabled={!handleSetOutputAmount}
        handleSetAmount={handleSetOutputAmount}
        handleSetMax={handleSetOutputMax}
        handleSetAddress={handleSetOutputAddress}
        addressDisabled={outputAddressDisabled}
      />
      {error && <ErrorMessage error={error} />}
      {children}
    </Container>
  );
};
