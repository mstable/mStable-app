import React, { FC } from 'react';
import styled from 'styled-components';

import { SubscribedToken } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import { ThemedSkeleton } from './ThemedSkeleton';

export type FetchRate = { value?: BigDecimal; fetching?: boolean };

interface Props {
  inputLabel?: string;
  outputLabel?: string;
  inputToken?: SubscribedToken;
  outputToken?: SubscribedToken;
  exchangeRate: FetchRate;
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 0.5rem;

  font-size: 0.95rem;
  text-align: right;
  color: ${({ theme }) => theme.color.grey};

  span {
    white-space: pre;
  }
`;

const Numeric = styled.span`
  ${({ theme }) => theme.mixins.numeric};
`;

export const ExchangeRate: FC<Props> = ({
  exchangeRate,
  inputToken,
  outputToken,
  inputLabel,
  outputLabel,
}) => {
  const hasInput = inputLabel || inputToken;
  return (
    <Container>
      {exchangeRate.fetching && <ThemedSkeleton height={16} width={150} />}
      {exchangeRate.value && (
        <>
          <span>≈ </span>
          <Numeric>{exchangeRate.value.format(6)}</Numeric>
          <span> {outputLabel ?? outputToken?.symbol} </span>
          {hasInput && <span>per {inputLabel ?? inputToken?.symbol}</span>}
        </>
      )}
    </Container>
  );
};
