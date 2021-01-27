import React, { FC } from 'react';
import styled from 'styled-components';

import { SubscribedToken } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import { Button } from '../core/Button';
import { ExchangeRate } from '../core/ExchangeRate';
import { AssetInput } from './AssetInput';

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
  inputAssets: AssetState[];
  outputAssets: AssetState[];
  onAmountChange(address: string, formValue?: string): void;
  onMaxAmountClick(address: string): void;
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
  onAmountChange,
  onMaxAmountClick,
  spender,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSetAddress = (address: string): void => {};

  // use to swap layout & usage
  // const isManyToOne = outputTokens.length === 1;

  const singleInputToken =
    inputAssets.filter(asset => (asset.amount?.simple ?? 0) > 0).length === 1
      ? inputAssets.find(asset => (asset.amount?.simple ?? 0) > 0)?.token
      : undefined;

  return (
    <Container>
      {spender &&
        inputAssets
          .sort((a, b) => a.index - b.index)
          .map(asset => (
            <AssetInput
              key={asset.address}
              address={asset.address}
              addressDisabled
              addressOptions={[]} // ?
              amountDisabled={false}
              formValue={asset.formValue}
              handleSetAddress={handleSetAddress}
              handleSetAmount={onAmountChange}
              handleSetMax={onMaxAmountClick}
              spender={spender}
            />
          ))}
      <Arrow>↓</Arrow>
      {outputAssets.length > 0 && (
        <ExchangeRate
          inputToken={singleInputToken}
          outputToken={outputAssets[0].token}
          exchangeRate={{
            value: outputAssets[0]?.exchangeRate,
            fetching: false,
          }}
        />
      )}
      {outputAssets
        .sort((a, b) => a.index - b.index)
        .map(asset => (
          <AssetInput
            key={asset.address}
            disabled
            address={asset.address}
            addressDisabled
            addressOptions={[]} // ?
            amountDisabled
            formValue={asset.formValue}
            handleSetAddress={handleSetAddress}
            handleSetAmount={onAmountChange}
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
