import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../theme';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { AssetOutputWidget } from './AssetOutputWidget';
import { ErrorMessage } from '../core/ErrorMessage';
import { Arrow } from '../core/Arrow';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div {
    display: flex;
    justify-content: space-between;
  }
`;

const Exchange = styled.div`
  flex-direction: column;
  max-width: 32rem;
  align-self: center;
  width: 100%;

  > div:first-child {
    margin-bottom: 1rem;
  }
`;

const Details = styled.div`
  flex-direction: column-reverse;
  max-width: 32rem;
  width: 100%;
  align-self: center;

  > * {
    margin-top: 0.75rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      flex-basis: 47.5%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  > :last-child {
    display: flex;
    flex-direction: column;

    > div {
      margin: 0.5rem 0;
    }

    > * > {
      display: flex;
      flex-direction: row;

      * {
        width: 100%;
      }
    }
  }
`;

export const AssetExchange: FC<{
  inputAddress?: string;
  inputAddressDisabled?: boolean;
  inputAddressOptions: {
    address: string;
    label?: string; // e.g. for vault label
    balance?: BigDecimal; // e.g. for vault balance
  }[];

  inputAmount?: BigDecimal;
  inputAmountDisabled?: boolean;
  inputLabel?: string;
  inputFormValue?: string;

  handleSetAddress?(address: string): void;
  handleSetAmount?(formValue?: string): void;
  handleSetMax?(): void;

  outputAddress?: string;
  outputLabel?: string;
  outputBalance?: BigDecimal;
  exchangeRate?: { value?: BigDecimal; fetching?: boolean }; // e.g. for mUSD->imUSD
  error?: string;
}> = ({
  children,
  error,
  exchangeRate,
  handleSetAddress,
  handleSetAmount,
  handleSetMax,
  inputAddress,
  inputAddressDisabled,
  inputAddressOptions,
  inputAmount,
  inputAmountDisabled,
  inputLabel,
  inputFormValue,
  outputAddress,
  outputBalance,
  outputLabel,
}) => {
  return (
    <Container>
      <Exchange>
        <AssetInput
          address={inputAddress}
          addressDisabled={inputAddressDisabled}
          addressOptions={inputAddressOptions}
          amountDisabled={inputAmountDisabled}
          formValue={inputFormValue}
          handleSetAddress={handleSetAddress}
          handleSetAmount={handleSetAmount}
          handleSetMax={handleSetMax}
        />
        <Arrow />
        <AssetOutputWidget
          exchangeRate={exchangeRate}
          inputAmount={inputAmount}
          inputAddress={inputAddress}
          inputLabel={inputLabel}
          outputAddress={outputAddress}
          outputBalance={outputBalance}
          outputLabel={outputLabel}
        />
      </Exchange>
      <Details>
        <Column>
          {error && <ErrorMessage error={error} />}
          <div>{children}</div>
        </Column>
      </Details>
    </Container>
  );
};
