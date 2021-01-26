import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';
import { SubscribedToken } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import { Button } from '../core/Button';
import { ExchangeRate, FetchRate } from '../core/ExchangeRate';
import { AssetInput } from './AssetInput';

interface Props {}

// TODO: - Pull out into state / spread between props & state.
const mBTCMock: {
  bAssets?: string[];
  inputToken: SubscribedToken;
  exchangeRate: FetchRate;
} = {
  bAssets: ['12'],
  inputToken: {
    balance: new BigDecimal(10, 10),
    allowances: { '0x': new BigDecimal(10, 10) },
    address: '0x',
    decimals: 10,
    symbol: 'mBTC',
    totalSupply: new BigDecimal(10, 10),
    price: new BigDecimal(10, 10),
  },
  exchangeRate: {
    value: new BigDecimal(10, 10),
    fetching: false,
  },
};

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

export const MultiAssetExchange: FC<Props> = () => {
  const massetState = useSelectedMassetState();

  const bAssets: SubscribedToken[] = Object.values(
    massetState?.bAssets ?? {},
  ).map(b => b.token);

  const handleSetAddress = (address: string) => {};
  const handleSetAmount = (formValue?: string | undefined) => {};
  const handleSetMax = () => {};

  // const { bAssets } = mBTCMock;
  return (
    <Container>
      {bAssets.map((t, i) => (
        <AssetInput
          address={t.address}
          addressDisabled
          addressOptions={[]} // ?
          amountDisabled={false}
          // formValue="100"
          handleSetAddress={handleSetAddress}
          handleSetAmount={handleSetAmount}
          handleSetMax={handleSetMax}
          // error={i === 0 ? 'error' : undefined}
          needsUnlock={i === 0}
          showUnlockStatus
        />
      ))}
      <Arrow>↓</Arrow>
      <ExchangeRate
        inputToken={mBTCMock.inputToken}
        outputToken={mBTCMock.inputToken}
        exchangeRate={mBTCMock.exchangeRate}
      />
      {bAssets.length > 0 && (
        <AssetInput
          disabled
          address={bAssets[0].address}
          addressDisabled
          addressOptions={[]} // ?
          amountDisabled
          // formValue="100"
          handleSetAddress={handleSetAddress}
          handleSetAmount={handleSetAmount}
        />
      )}

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
