import React, { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useHasPendingTransactions } from '../../context/TransactionsProvider';

interface Props {
  hasPendingTxs: boolean;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div<Props>`
  background: ${props =>
    props.hasPendingTxs ? props.theme.color.blue : 'transparent'};
  width: 16px;
  height: 16px;
  animation: ${props =>
    props.hasPendingTxs
      ? css`
          ${rotate} 1s linear infinite
        `
      : 'none'};
`;

/**
 * Component to show app activity such as pending transactions.
 * @TODO design and content
 */
export const Activity: FC<{}> = () => {
  const hasPendingTxs = useHasPendingTransactions();
  return <Container hasPendingTxs={hasPendingTxs} />;
};
