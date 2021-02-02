import React, { FC } from 'react';
import styled from 'styled-components';

import { useTokenSubscription } from '../../context/TokensProvider';
import { ViewportWidth } from '../../theme';
import { BigDecimal } from '../../web3/BigDecimal';
import { AssetInput } from './AssetInput';
import { ExchangeRate } from '../core/ExchangeRate';
import { Widget } from '../core/Widget';
import { Tooltip } from '../core/ReactTooltip';
import { SlippageInput } from './SlippageInput';
import { Arrow } from '../core/Arrow';

interface Props {
  addressOptions: {
    address: string;
    label?: string; // e.g. for vault label
    balance?: BigDecimal; // e.g. for vault balance
  }[];

  inputAddress?: string;
  inputFormValue?: string;
  handleSetInputAddress?(address?: string): void;
  handleSetInputAmount?(formValue?: string): void;
  handleSetInputMax?(): void;

  outputAddress?: string;
  outputFormValue?: string;
  minOutputAmount?: BigDecimal;
  handleSetOutputAddress?(address?: string): void;
  handleSetOutputAmount?(formValue?: string): void;
  handleSetOutputMax?(): void;

  slippageFormValue?: string;
  handleSetSlippage?(formValue?: string): void;

  exchangeRate?: { value?: BigDecimal; fetching?: boolean }; // e.g. for mUSD->imUSD
  fee?: BigDecimal;
  error?: string;
}

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
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 0.5rem;

  > * {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Details = styled.div`
  flex-direction: column;

  > * {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      flex-basis: 47.5%;
    }
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;

  > span:last-child {
    ${({ theme }) => theme.mixins.numeric}
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
  fee,
  handleSetInputAddress,
  handleSetInputAmount,
  handleSetInputMax,
  handleSetOutputAddress,
  handleSetOutputAmount,
  handleSetOutputMax,
  handleSetSlippage,
  inputAddress,
  inputFormValue,
  minOutputAmount,
  outputAddress,
  outputFormValue,
  slippageFormValue,
}) => {
  const inputToken = useTokenSubscription(inputAddress);
  const outputToken = useTokenSubscription(outputAddress);

  return (
    <Container>
      <Exchange>
        <Widget title="Send" boldTitle>
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
        </Widget>
        <Arrow />
        <Widget
          title="Receive"
          boldTitle
          headerContent={
            exchangeRate && (
              <ExchangeRate
                exchangeRate={exchangeRate}
                outputToken={outputToken}
                inputToken={inputToken}
              />
            )
          }
        >
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
        </Widget>
      </Exchange>
      <Details>
        {handleSetSlippage && (
          <Info>
            <SlippageInput
              handleSetSlippage={handleSetSlippage}
              slippageFormValue={slippageFormValue}
            />
          </Info>
        )}
        {fee && (
          <Info>
            <p>
              <Tooltip tip="The received amount includes a small swap fee. Swap fees are sent directly to Savers.">
                Swap fee
              </Tooltip>
            </p>
            <span>{fee.string}</span>
          </Info>
        )}
        {minOutputAmount && (
          <Info>
            <p>
              <Tooltip tip="The minimum amount received (based on the estimated swap output and the selected slippage).">
                Minimum amount received
              </Tooltip>
            </p>
            <span>{minOutputAmount.string}</span>
          </Info>
        )}
        {error && (
          <Error>
            <p>{error}</p>
          </Error>
        )}
      </Details>
    </Container>
  );
};
