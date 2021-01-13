import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../theme';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { AssetOutputWidget } from './AssetOutputWidget';

interface Props {
  inputAddress?: string;
  inputAddressDisabled?: boolean;
  inputAddressOptions: {
    address: string;
    label?: string; // e.g. for vault label
    balance?: BigDecimal; // e.g. for vault balance
  }[];

  inputAmount?: BigDecimal;
  inputAmountDisabled?: boolean;
  inputFormValue?: string;

  handleSetAddress?(address: string): void;
  handleSetAmount?(formValue?: string): void;
  handleSetMax?(): void;

  outputAddress?: string;
  outputLabel?: string;
  exchangeRate?: BigDecimal; // e.g. for mUSD->imUSD
  slippage?: BigDecimal;
  error?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    display: flex;
    justify-content: space-between;
  }
`;

const Exchange = styled.div`
  flex-direction: column;
`;

const Details = styled.div`
  flex-direction: column-reverse;

  > * {
    margin-top: 0.75rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      flex-basis: 47.5%;
    }
  }
`;

const Arrow = styled.div`
  align-items: center;
  display: flex;
  font-size: 1.25rem;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  user-select: none;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > :last-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    > * > {
      display: flex;
      flex-direction: row;
      gap: 1rem;

      * {
        width: 100%;
      }
    }
  }
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 2rem;
  margin-bottom: 0.75rem;
  background: ${({ theme }) => theme.color.redTransparenter};

  p {
    text-align: center;
    opacity: 0.75;
    font-size: 0.875rem;
    line-height: 1.75em;
  }
`;

export const AssetExchange: FC<Props> = ({
  children,
  error,
  handleSetAddress,
  handleSetAmount,
  handleSetMax,
  inputAddress,
  inputAddressDisabled,
  inputAddressOptions,
  inputAmount,
  inputAmountDisabled,
  inputFormValue,
  outputAddress,
  outputLabel,
  exchangeRate,
  slippage,
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
        <Arrow>↓</Arrow>
        <AssetOutputWidget
          exchangeRate={exchangeRate}
          inputAmount={inputAmount}
          inputAddress={inputAddress}
          outputAddress={outputAddress}
          outputLabel={outputLabel}
          title="Receive"
        />
      </Exchange>
      <Details>
        <Column>
          {error && (
            <Error>
              <p>{error}</p>
            </Error>
          )}
          <div>{children}</div>
        </Column>
        {slippage && (
          <Info>
            <p>Slippage Tolerance</p>
            <span>{slippage?.format(2)}%</span>
          </Info>
        )}
      </Details>
    </Container>
  );
};
