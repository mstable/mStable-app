import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import {
  useBigDecimalInputs,
  InitialiserArg,
} from '../../hooks/useBigDecimalInputs';

import { SubscribedToken } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import { Button } from '../core/Button';
import { ExchangeRate } from '../core/ExchangeRate';
import { AssetInput } from './AssetInput';

const BIG_ZERO = new BigDecimal((0e18).toString());

// TODO: - Remove once not mocked
const mockExchangeMapping: { [key: string]: BigDecimal } = {
  '0x82e6459d1b9529cc6a8203f1bfe3b04d6cfcbd43': new BigDecimal(
    (1e18).toString(),
  ),
  '0xd4da7c3b1c985b8baec8d2a5709409ccfe809096': new BigDecimal(
    (2e18).toString(),
  ),
  '0xf08d8ab65e709b66e77908cc4edb530113d8d855': new BigDecimal(
    (0.5e18).toString(),
  ),
};

export interface AssetState {
  index: number;
  address: string;
  amount?: BigDecimal;
  formValue?: string;
  decimals: number;
  enabled: boolean;
  error?: string;
  token: SubscribedToken;
  exchangeRate?: BigDecimal;
}

interface Props {
  inputAssets: InitialiserArg;
  outputAssets: InitialiserArg;
  spender?: string;
}

const AdvancedButton = styled(Button)`
  width: 100%;
  border-radius: 0.75rem;
  font-weight: normal;
  color: ${({ theme }) => theme.color.body};

  div {
    display: flex;
    justify-content: space-between;
  }
`;

const SendButton = styled(Button)`
  width: 100%;
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

const Container = styled.div`
  width: 70%;

  > * {
    margin: 0.5rem 0;
  }
`;

export const MultiAssetExchange: FC<Props> = ({
  inputAssets,
  outputAssets,
  spender,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSetAddress = (address: string): void => {};

  const [inputValues, inputCallbacks] = useBigDecimalInputs(inputAssets);
  const [outputValues, outputCallbacks] = useBigDecimalInputs(outputAssets);

  const isManyToOne =
    Object.keys(inputValues).length >= Object.keys(inputValues).length;

  // const singleInputToken =
  //   inputAssets.filter(asset => (asset.amount?.simple ?? 0) > 0).length === 1
  //     ? inputAssets.find(asset => (asset.amount?.simple ?? 0) > 0)?.token
  //     : undefined;

  // things to include:
  // symbol

  const nonZeroInputs = useMemo(
    () =>
      Object.keys(inputValues).filter(
        v => (inputValues[v].amount?.simple ?? 0) > 0,
      ),
    [inputValues],
  );

  const { outputAmount, exchangeRate } = useMemo(() => {
    if (!nonZeroInputs.length)
      return { outputAmount: BIG_ZERO, exchangeRate: undefined };

    const addressWithRate = nonZeroInputs.map<{
      amount: BigDecimal;
      exchangeRate: BigDecimal;
    }>(address => ({
      amount: inputValues[address].amount ?? BIG_ZERO,
      exchangeRate: mockExchangeMapping[address],
    }));

    const cumulativeAmount = Object.values(addressWithRate)
      .map<BigDecimal>(({ amount }) => amount)
      .reduce((a, b) => a.add(b));

    const outputAmount = Object.values(addressWithRate)
      .map<BigDecimal>(({ amount, exchangeRate }) =>
        amount.mulTruncate(exchangeRate.exact),
      )
      .reduce((a, b) => a.add(b));

    const exchangeRate =
      outputAmount.simple > 0
        ? outputAmount.divPrecisely(cumulativeAmount)
        : undefined;

    return { outputAmount, exchangeRate };
  }, [nonZeroInputs]);

  const exchangeRateInputToken =
    nonZeroInputs.length === 1 ? inputAssets[nonZeroInputs[0]] : undefined;

  return (
    <Container>
      {Object.keys(inputValues).map(
        address =>
          spender &&
          inputAssets && (
            <AssetInput
              key={address}
              disabled={!isManyToOne}
              address={address}
              addressDisabled
              addressOptions={[]} // ?
              amountDisabled={false}
              formValue={inputValues[address].formValue}
              handleSetAddress={handleSetAddress}
              handleSetAmount={inputCallbacks[address].setFormValue}
              handleSetMax={inputCallbacks[address].setMaxAmount}
              spender={spender}
            />
          ),
      )}
      <Arrow>↓</Arrow>
      {!!exchangeRate && (
        <ExchangeRate
          inputLabel={exchangeRateInputToken?.symbol}
          outputLabel={outputAssets[Object.keys(outputAssets)[0]]?.symbol}
          exchangeRate={{
            value: exchangeRate,
            fetching: !exchangeRate,
          }}
        />
      )}
      {Object.keys(outputValues).map(address => (
        <AssetInput
          key={address}
          disabled={isManyToOne}
          address={address}
          addressDisabled
          addressOptions={[]} // ?
          amountDisabled
          formValue={outputAmount.format(2, false)}
        />
      ))}
      <AdvancedButton transparent>
        <div>
          <div>Advanced</div>
          <div>▼</div>
        </div>
      </AdvancedButton>
      <SendButton highlighted>Unlock Tokens</SendButton>
    </Container>
  );
};
