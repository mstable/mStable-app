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

import { ExchangeRate } from '../core/ExchangeRate';
import { Arrow } from '../core/Arrow';

import { AssetInput } from './AssetInput';
import { SlippageInput } from './SlippageInput';
import { CollapseBox } from './CollapseBox';

type Dispatch = [
  BigDecimalInputCallbacks, // input callbacks
  (outputAmount: {
    fetching?: boolean;
    value?: BigDecimal;
    error?: string;
  }) => void, // set output amount
  (slippage?: string) => void, // set slippage
];

type State = [
  BigDecimalInputValues, // input values
  { fetching?: boolean; value?: BigDecimal; error?: string }, // output amount
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
  }
`;

interface Props {
  inputLabel?: string;
  outputLabel?: string;
  spender?: string;
  setMaxCallbacks?: { [address: string]: () => void };
  exchangeRate: { value?: BigDecimal; fetching?: boolean };
}

export const ManyToOneAssetExchange: FC<Props & { outputAddress: string }> = ({
  children,
  exchangeRate,
  spender,
  setMaxCallbacks,
  inputLabel = 'Input',
  outputLabel = 'Output',
  outputAddress,
}) => {
  const [inputValues, outputAmount, slippage] = useContext(stateCtx);
  const [inputCallbacks, , setSlippage] = useContext(dispatchCtx);

  return (
    <Container>
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
      <ExchangeRate
        inputLabel={inputLabel}
        outputLabel={outputLabel}
        exchangeRate={exchangeRate}
      />
      <AssetInput
        disabled
        address={outputAddress}
        addressDisabled
        formValue={outputAmount.value?.string}
      />
      <CollapseBox title="Advanced">
        <SlippageInput
          handleSetSlippage={setSlippage}
          slippageFormValue={slippage.formValue}
        />
      </CollapseBox>
      {children}
    </Container>
  );
};

export const OneToManyAssetExchange: FC<Props & { inputAddress: string }> = ({
  children,
  exchangeRate,
  spender,
  setMaxCallbacks,
  inputAddress,
  inputLabel = 'Input',
  outputLabel = 'Output',
}) => {
  const [outputValues, inputAmount, slippage] = useContext(stateCtx);
  const [outputCallbacks, , setSlippage] = useContext(dispatchCtx);

  return (
    <Container>
      <AssetInput
        disabled
        address={inputAddress}
        addressDisabled
        formValue={inputAmount.value?.string}
      />
      <Arrow />
      <ExchangeRate
        inputLabel={inputLabel}
        outputLabel={outputLabel}
        exchangeRate={exchangeRate}
      />
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
      {children}
      <CollapseBox title="Advanced">
        <SlippageInput
          handleSetSlippage={setSlippage}
          slippageFormValue={slippage.formValue}
        />
      </CollapseBox>
    </Container>
  );
};
