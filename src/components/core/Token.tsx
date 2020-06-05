import React, { FC } from 'react';
import styled from 'styled-components';
import { TokenIcon } from '../icons/TokenIcon';

interface Props {
  symbol: string;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.l};
  font-weight: bold;
  color: black;

  > img {
    width: 36px;
    height: 36px;
    padding-right: 6px;
  }
`;

export const Token: FC<Props> = ({ symbol }) => (
  <Container>
    <TokenIcon symbol={symbol} />
    <div>{symbol}</div>
  </Container>
);
