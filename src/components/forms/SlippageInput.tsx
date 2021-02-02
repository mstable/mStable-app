import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../core/Button';
import { AmountInputButton } from './AmountInputButton';

interface Props {
  slippageFormValue?: string;
  handleSetSlippage(formValue?: string): void;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  > :first-child {
    font-size: 0.8rem;
    margin-right: 1rem;
  }

  > :last-child {
    > * {
      ${({ theme }) => theme.mixins.numeric}
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
      margin-right: 0.5rem;
      padding: 0.25rem;

      > * {
        font-size: 0.8rem;
      }

      @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
        min-width: 5rem;
        margin-bottom: 0;
      }
    }
  }
`;

export const SlippageInput: FC<Props> = ({
  handleSetSlippage,
  slippageFormValue,
}) => (
  <Container>
    <div>Max slippage</div>
    <div>
      <Button
        highlighted={slippageFormValue === '0.1'}
        onClick={() => {
          handleSetSlippage('0.1');
        }}
      >
        0.1%
      </Button>
      <Button
        highlighted={slippageFormValue === '0.5'}
        onClick={() => {
          handleSetSlippage('0.5');
        }}
      >
        0.5%
      </Button>
      <Button
        highlighted={slippageFormValue === '1'}
        onClick={() => {
          handleSetSlippage('1');
        }}
      >
        1%
      </Button>
      <AmountInputButton
        onChange={handleSetSlippage}
        value={slippageFormValue}
        max="100"
        min="0"
      />
    </div>
  </Container>
);
