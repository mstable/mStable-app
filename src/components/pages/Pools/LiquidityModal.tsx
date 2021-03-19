import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useBigDecimalInput } from '../../../hooks/useBigDecimalInput';
import type { MassetState } from '../../../context/DataProvider/types';
import { ViewportWidth } from '../../../theme';

import { Plus } from '../../core/Arrow';
import { Button } from '../../core/Button';
import { AssetInput } from '../../forms/AssetInput';

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
  const massetState = useSelectedMassetState() as MassetState;
  const { feederPools } = massetState;

  const [, mInputFormValue, setMAmount] = useBigDecimalInput();
  const [, fInputFormValue, setFAmount] = useBigDecimalInput();

  const fassets = useMemo(
    () =>
      Object.values(feederPools).map(feederPool => feederPool.fasset.address),
    [feederPools],
  );

  const [fAddress, setFAddress] = useState<string | undefined>(fassets[0]);

  // TODO get X% value
  return (
    <Container>
      <Message>
        By providing liquidity, you will earn X% of fees from all trades
        proportional to your share of the pool.
      </Message>
      <AssetInput
        addressOptions={fassets}
        address={fAddress}
        handleSetAddress={setFAddress}
        handleSetAmount={setFAmount}
        formValue={fInputFormValue}
      />
      <div>
        <Plus />
      </div>
      <AssetInput
        addressOptions={[massetState.address]}
        address={massetState.address}
        addressDisabled
        handleSetAmount={setMAmount}
        formValue={mInputFormValue}
      />
      <Button
        highlighted
        onClick={() => {
          // TODO
          alert('TODO deposit');
        }}
      >
        Deposit
      </Button>
    </Container>
  );
};
