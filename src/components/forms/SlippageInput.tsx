import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../core/Button';
import { AmountInputButton } from './AmountInputButton';

interface Props {
  slippage?: string;
  handleSetSlippage(formValue?: string): void;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  > :first-child {
    margin-right: 1rem;
  }

  > :last-child {
    > * {
      ${({ theme }) => theme.mixins.numeric}
      margin-bottom: 0.5rem;
      margin-right: 0.5rem;
      @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
        min-width: 6rem;
        margin-bottom: 0;
      }
    }
  }
`;

export const SlippageInput: FC<Props> = ({ handleSetSlippage, slippage }) => (
  <Container>
    <p>Max slippage</p>
    <div>
      <Button
        highlighted={slippage === '0.1'}
        onClick={() => {
          handleSetSlippage('0.1');
        }}
      >
        0.1%
      </Button>
      <Button
        highlighted={slippage === '0.5'}
        onClick={() => {
          handleSetSlippage('0.5');
        }}
      >
        0.5%
      </Button>
      <Button
        highlighted={slippage === '1'}
        onClick={() => {
          handleSetSlippage('1');
        }}
      >
        1%
      </Button>
      <AmountInputButton
        onChange={handleSetSlippage}
        value={slippage}
        max="100"
        min="0"
      />
    </div>
  </Container>
);
