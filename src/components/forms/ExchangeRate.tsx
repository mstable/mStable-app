import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { BigDecimal } from '../../web3/BigDecimal';
import { SubscribedToken } from '../../types';

interface Props {
  exchangeRate: { value?: BigDecimal; fetching?: boolean };
  inputToken?: SubscribedToken;
  inputLabel?: string;
  outputLabel?: string;
  outputToken?: SubscribedToken;
}

const Container = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.color.grey};

  span {
    ${({ theme }) => theme.mixins.numeric};
  }
`;

export const ExchangeRate: FC<Props> = ({
  exchangeRate,
  inputToken,
  inputLabel,
  outputLabel,
  outputToken,
}) => (
  <Container>
    {exchangeRate.fetching && <Skeleton height={16} width={150} />}
    {exchangeRate.value && (
      <>
        <span>1</span>
        {` `}
        {inputLabel ?? inputToken?.symbol}
        <span> ≈ {exchangeRate.value.format(6)}</span>
        {` ${outputLabel ?? outputToken?.symbol}`}
      </>
    )}
  </Container>
);
