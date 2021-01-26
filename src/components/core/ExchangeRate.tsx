import React, { FC } from 'react';
import styled from 'styled-components';

import { SubscribedToken } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import { ThemedSkeleton } from './ThemedSkeleton';

export type FetchRate = { value?: BigDecimal; fetching?: boolean };

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 0.5rem;

  p {
    font-size: 0.95rem;
    text-align: right;
    color: ${({ theme }) => theme.color.grey};

    span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }
`;

export const ExchangeRate: FC<{
  inputLabel?: string;
  outputLabel?: string;
  inputToken?: SubscribedToken;
  outputToken?: SubscribedToken;
  exchangeRate: FetchRate;
}> = ({ exchangeRate, inputToken, outputToken, inputLabel, outputLabel }) => (
  <Container>
    <p>
      {exchangeRate.fetching && <ThemedSkeleton height={16} width={150} />}
      {exchangeRate.value && (
        <>
          <span>1</span>
          {` ${inputLabel ?? inputToken?.symbol}`}
          <span> ≈ {exchangeRate.value.format(6)}</span>
          {` ${outputLabel ?? outputToken?.symbol}`}
        </>
      )}
    </p>
  </Container>
);
