import React, { FC } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {
  useTransactionsDispatch,
  useTransactionsState,
} from '../../context/TransactionsProvider';
import { TransactionStatus } from '../../web3/TransactionManifest';
import { Button } from '../core/Button';
import { Color } from '../../theme';
import { GasStation } from './GasStation';
import { TransactionGasProvider, useGas } from './TransactionGasProvider';

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
`;

const Purpose = styled.div`
  font-size: 1.3rem;
`;

const Container = styled.div<{ status: TransactionStatus }>`
  min-width: 24rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 1px
    ${({ status, theme }) =>
      status === TransactionStatus.Confirmed
        ? theme.color.green
        : status === TransactionStatus.Error
        ? theme.color.red
        : theme.color.lightGrey}
    solid;
  border-radius: 1rem;
  color: ${Color.grey};
  background: white;
`;

const PendingTransaction: FC<{
  id: string;
}> = ({ id }) => {
  const { [id]: transaction } = useTransactionsState();
  const { cancel, send } = useTransactionsDispatch();
  const { gasLimit, gasPrice } = useGas();

  if (!transaction) {
    return null;
  }

  const disabled =
    !gasLimit || !gasPrice || transaction.status !== TransactionStatus.Pending;

  return (
    <Container status={transaction.status}>
      <Purpose>{transaction.manifest.purpose.present}</Purpose>
      {transaction.status === TransactionStatus.Pending && <GasStation />}
      <Buttons>
        <Button
          scale={0.75}
          onClick={() => {
            cancel(transaction.manifest.id);
          }}
        >
          Cancel
        </Button>
        <Button
          scale={0.75}
          highlighted={!disabled}
          disabled={disabled}
          onClick={() => {
            if (gasPrice && gasLimit) {
              send(transaction.manifest, gasLimit, gasPrice);
            }
          }}
        >
          Send transaction
        </Button>
      </Buttons>
    </Container>
  );
};

const slideIn = keyframes`
  0% {
    transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    transform-origin: 50% 0;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
`;

const Animation = styled(CSSTransition)`
  ${({ classNames }) => `&.${classNames}-enter`} {
    animation: ${css`
        ${slideIn}`} 0.6s cubic-bezier(0.19, 1, 0.22, 1) normal;
  }

  ${({ classNames }) => `&.${classNames}-exit-active`} {
    animation: ${css`
        ${slideIn}`} 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse;
  }
`;

const FixedContainer = styled.div`
  position: fixed;
  right: 1rem;
  top: 7rem;
  bottom: 1rem;
  z-index: 2;
`;

export const PendingTransactions: FC = () => {
  const state = useTransactionsState();

  return (
    <FixedContainer>
      <TransitionGroup>
        {Object.keys(state)
          .filter(
            id =>
              state[id].status === TransactionStatus.Pending ||
              state[id].status === TransactionStatus.Sent,
          )
          .sort(
            (a, b) => state[b].manifest.createdAt - state[a].manifest.createdAt,
          )
          .map(id => (
            <Animation
              timeout={{ enter: 500, exit: 200 }}
              classNames="item"
              key={id}
            >
              <div>
                <TransactionGasProvider id={id}>
                  <PendingTransaction id={id} />
                </TransactionGasProvider>
              </div>
            </Animation>
          ))}
      </TransitionGroup>
    </FixedContainer>
  );
};
