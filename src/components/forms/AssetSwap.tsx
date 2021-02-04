import React, { FC } from 'react';
import styled from 'styled-components';

import { useTokenSubscription } from '../../context/TokensProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { ExchangeRate } from '../core/ExchangeRate';
import { Arrow } from '../core/Arrow';
import { TransactionOption } from '../../types';
import { ErrorMessage } from '../core/ErrorMessage';

interface Props {
  addressOptions: TransactionOption[];

  inputAddress?: string;
  inputFormValue?: string;
  handleSetInputAddress?(address?: string): void;
  handleSetInputAmount?(formValue?: string): void;
  handleSetInputMax?(): void;

  outputAddress?: string;
  outputFormValue?: string;
  handleSetOutputAddress?(address?: string): void;
  handleSetOutputAmount?(formValue?: string): void;
  handleSetOutputMax?(): void;

  exchangeRate: { value?: BigDecimal; fetching?: boolean }; // e.g. for mUSD->imUSD
  error?: string;
}

const Container = styled.div`
  > * {
    margin: 0.5rem 0;
  }
`;

export const AssetSwap: FC<Props> = ({
  addressOptions,
  error,
  exchangeRate,
  handleSetInputAddress,
  handleSetInputAmount,
  handleSetInputMax,
  handleSetOutputAddress,
  handleSetOutputAmount,
  handleSetOutputMax,
  inputAddress,
  inputFormValue,
  outputAddress,
  outputFormValue,
  children,
}) => {
  const inputToken = useTokenSubscription(inputAddress);
  const outputToken = useTokenSubscription(outputAddress);

  return (
    <Container>
      <AssetInput
        address={inputAddress}
        addressOptions={addressOptions}
        formValue={inputFormValue}
        handleSetAmount={handleSetInputAmount}
        handleSetMax={handleSetInputMax}
        handleSetAddress={address => {
          handleSetInputAddress?.(address);
          if (address === outputAddress) {
            handleSetOutputAddress?.(inputAddress);
          }
        }}
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
        addressOptions={addressOptions}
        formValue={outputFormValue}
        amountDisabled={!handleSetOutputAmount}
        handleSetAmount={handleSetOutputAmount}
        handleSetMax={handleSetOutputMax}
        handleSetAddress={address => {
          handleSetOutputAddress?.(address);
          if (address === inputAddress) {
            handleSetInputAddress?.(outputAddress);
          }
        }}
      />
      {error && <ErrorMessage error={error} />}
      {children}
    </Container>
  );
};
