import React, { createContext, FC, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';

import {
  useBigDecimalInputs,
  UseBigDecimalInputsArg,
  BigDecimalInputCallbacks,
  BigDecimalInputValues,
} from '../../hooks/useBigDecimalInputs';

import { BigDecimal } from '../../web3/BigDecimal';
import { useSimpleInput } from '../../hooks/useSimpleInput';
import type { FetchState } from '../../hooks/useFetchState';

import { ExchangeRate } from '../core/ExchangeRate';

import { AssetInput } from './AssetInput';
import { Arrow } from '../core/Arrow';
import { TransactionInfo } from '../core/TransactionInfo';
import { ErrorMessage } from '../core/ErrorMessage';

type Dispatch = [
  BigDecimalInputCallbacks, // input callbacks
  (outputAmount: FetchState<BigDecimal>) => void, // set output amount
  (slippage?: string) => void, // set slippage
];

type State = [
  BigDecimalInputValues, // input values
  FetchState<BigDecimal>, // output amount
  { simple?: number; formValue?: string }, // slippage
];

const dispatchCtx = createContext<Dispatch>(null as never);
const stateCtx = createContext<State>(null as never);

export const useMultiAssetExchangeDispatch = (): Dispatch =>
  useContext(dispatchCtx);

export const useMultiAssetExchangeState = (): State => useContext(stateCtx);

export const MultiAssetExchangeProvider: FC<{
  assets: UseBigDecimalInputsArg;
}> = ({ children, assets }) => {
  const [values, callbacks] = useBigDecimalInputs(assets);
  const [amount, setAmount] = useState<State[1]>({});

  const [slippageSimple, slippageFormValue, setSlippage] = useSimpleInput(0.1, {
    min: 0.01,
    max: 99.99,
  });

  const dispatch = useMemo<Dispatch>(
    () => [callbacks, setAmount, setSlippage],
    [callbacks, setAmount, setSlippage],
  );

  const state = useMemo<State>(
    () => [
      values,
      amount,
      { simple: slippageSimple, formValue: slippageFormValue },
    ],
    [values, amount, slippageFormValue, slippageSimple],
  );

  return (
    <dispatchCtx.Provider value={dispatch}>
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

const Container = styled.div`
  > * {
    margin: 0.5rem 0;
    &:first-child {
      margin-top: 0;
    }
  }
`;

interface Props {
  inputLabel?: string;
  outputLabel?: string;
  spender?: string;
  setMaxCallbacks?: { [address: string]: () => void };
  exchangeRate?: { value?: BigDecimal; fetching?: boolean };
  error?: string;
  price?: number;
  className?: string;
}

// TODO: I think the provider logic of MultiAssetExchange could be dropped.

export const ManyToOneAssetExchange: FC<
  Props & {
    outputAddress: string;
    minOutputAmount?: BigDecimal;
  }
> = ({
  children,
  exchangeRate,
  spender,
  setMaxCallbacks,
  inputLabel = 'Input',
  outputLabel = 'Output',
  outputAddress,
  error,
  minOutputAmount,
  price,
  className,
}) => {
  const [inputValues, outputAmount, slippage] = useContext(stateCtx);
  const [inputCallbacks, , setSlippage] = useContext(dispatchCtx);
  return (
    <Container className={className}>
      {Object.keys(inputValues).map(
        address =>
          spender &&
          inputValues && (
            <AssetInput
              key={address}
              address={address}
              addressDisabled
              formValue={inputValues[address].formValue}
              handleSetAmount={inputCallbacks[address].setFormValue}
              handleSetMax={setMaxCallbacks?.[address]}
              spender={spender}
            />
          ),
      )}
      <Arrow />
      {exchangeRate && (
        <ExchangeRate
          inputLabel={inputLabel}
          outputLabel={outputLabel}
          exchangeRate={exchangeRate}
        />
      )}
      <AssetInput
        amountDisabled
        address={outputAddress}
        addressDisabled
        formValue={outputAmount.value?.string}
      />
      {error && <ErrorMessage error={error} />}
      {children}
      <TransactionInfo
        price={price}
        onSetSlippage={setSlippage}
        slippageFormValue={slippage.formValue}
        minOutputAmount={minOutputAmount}
      />
    </Container>
  );
};

export const OneToManyAssetExchange: FC<
  Props & {
    inputAddress: string;
    maxOutputAmount?: BigDecimal;
  }
> = ({
  children,
  exchangeRate,
  spender,
  setMaxCallbacks,
  inputAddress,
  inputLabel = 'Input',
  outputLabel = 'Output',
  maxOutputAmount,
  error,
  price,
}) => {
  const [outputValues, inputAmount, slippage] = useContext(stateCtx);
  const [outputCallbacks, , setSlippage] = useContext(dispatchCtx);

  return (
    <Container>
      <AssetInput
        address={inputAddress}
        addressDisabled
        formValue={inputAmount.value?.string}
        amountDisabled
      />
      <div>
        <Arrow />
        {exchangeRate && (
          <ExchangeRate
            inputLabel={inputLabel}
            outputLabel={outputLabel}
            exchangeRate={exchangeRate}
          />
        )}
      </div>
      {Object.keys(outputValues).map(address => (
        <AssetInput
          key={address}
          address={address}
          addressDisabled
          formValue={outputValues[address].formValue}
          handleSetAmount={outputCallbacks[address].setFormValue}
          handleSetMax={setMaxCallbacks?.[address]}
          spender={spender}
        />
      ))}
      {error && <ErrorMessage error={error} />}
      {children}
      <TransactionInfo
        price={price}
        onSetSlippage={setSlippage}
        slippageFormValue={slippage.formValue}
        maxOutputAmount={maxOutputAmount}
      />
    </Container>
  );
};
