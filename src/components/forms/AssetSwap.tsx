import React, { FC } from 'react';
import styled from 'styled-components';

import { useTokenSubscription } from '../../context/TokensProvider';
import { ViewportWidth } from '../../theme';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { ExchangeRate } from '../core/ExchangeRate';
import { Arrow } from '../core/Arrow';
import { TransactionOption } from '../../types';

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
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    justify-content: space-between;
  }
`;

const Exchange = styled.div`
  flex-direction: column;

  > * {
    margin: 0.5rem 0;
  }
`;

const Details = styled.div`
  flex-direction: column;

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      flex-basis: 47.5%;
    }
  }

  > * {
    margin: 0.5rem 0;
  }
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  margin-bottom: 0.75rem;
  background: ${({ theme }) => theme.color.redTransparenter};

  p {
    text-align: center;
    opacity: 0.75;
    font-size: 0.875rem;
    line-height: 1.75em;
    max-width: 50ch;
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
}) => {
  const inputToken = useTokenSubscription(inputAddress);
  const outputToken = useTokenSubscription(outputAddress);

  return (
    <Container>
      <Exchange>
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
      </Exchange>
      <Details>
        {error && (
          <Error>
            <p>{error}</p>
          </Error>
        )}
      </Details>
    </Container>
  );
};
