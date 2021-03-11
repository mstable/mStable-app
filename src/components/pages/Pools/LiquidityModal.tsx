import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useTokens } from '../../../context/TokensProvider';
import { useBigDecimalInput } from '../../../hooks/useBigDecimalInput';
import { ViewportWidth } from '../../../theme';

import { Plus } from '../../core/Arrow';
import { Button } from '../../core/Button';
import { AssetInput } from '../../forms/AssetInput';
import { mockData } from './mock';

const Message = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  border: 1px solid ${({ theme }) => theme.color.accent};
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  > button {
    margin-top: 1rem;
    height: 3rem;
  }

  > div:first-child {
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    padding: 2rem;
  }
`;

export const LiquidityModal: FC = () => {
  const massetState = useSelectedMassetState();
  const [, mInputFormValue, setMAmount] = useBigDecimalInput();
  const [, fInputFormValue, setFAmount] = useBigDecimalInput();

  const mToken = massetState?.token;
  const mAddress = (mToken && mToken?.address) || undefined;
  const mTokenAddressOptions =
    (mToken && [
      {
        address: mToken.address,
        symbol: mToken.symbol,
        balance: mToken.balance,
      },
    ]) ||
    undefined;

  const { fAssets } = mockData;
  const fTokens = useTokens(fAssets);
  const fTokenAddressOptions = fTokens?.map(token => ({
    address: token.address,
    symbol: token.symbol,
    balance: token.balance,
  }));

  const [fAddress, setFAddress] = useState<string | undefined>(
    fTokenAddressOptions?.[0]?.address,
  );

  return (
    <Container>
      <Message>
        By providing liquidity, you will earn X% of fees from all trades
        proportional to your share of the pool.
      </Message>

      <AssetInput
        addressOptions={fTokenAddressOptions}
        address={fAddress}
        handleSetAddress={setFAddress}
        handleSetAmount={setFAmount}
        formValue={fInputFormValue}
      />
      <div>
        <Plus />
      </div>
      <AssetInput
        addressOptions={mTokenAddressOptions}
        address={mAddress}
        addressDisabled
        handleSetAmount={setMAmount}
        formValue={mInputFormValue}
      />
      <Button highlighted>Deposit</Button>
    </Container>
  );
};
