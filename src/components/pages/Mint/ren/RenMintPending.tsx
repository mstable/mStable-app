import React, { FC, useMemo, useEffect } from 'react';
import styled from 'styled-components';

import { Tooltip } from '../../../core/ReactTooltip';
import { getEtherscanLink, truncateAddress } from '../../../../utils/strings';
import { ExternalLink } from '../../../core/ExternalLink';
import { useRenState } from '../../../../context/RenProvider';
import { Step } from './types';
import { useRenMintStep } from './RenMintProvider';

const Address = styled(ExternalLink)`
  font-size: 0.875rem;
  padding: 0 1.75rem;
  word-break: break-all;
  text-align: center;
`;

const TransactionBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;
  width: 18rem;
  align-self: center;
  align-items: center;

  p {
    line-height: 1.5rem;
    text-align: center;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
  }

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const TransactionStatus = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.color.bodyAccent};
`;

const Confirmation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  > *:not(:first-child) {
    line-height: 1rem;
    align-items: center;
    display: flex;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.green};
  }
`;

export const RenMintPending: FC = () => {
  const { current, storage } = useRenState();
  const [_, setStep] = useRenMintStep();

  const currentId = current?.id;
  const currentTransaction = (currentId && storage[currentId]) || undefined;

  const btcConfirmations = useMemo(() => currentTransaction?.btcConfirmations, [
    currentTransaction,
  ]);

  // FIXME: - Remove mock
  const txAddress =
    '0x79ee804f27c9724fcb4181b0e43de8ad1dbca198b1323a21156336eae23cba32';

  useEffect(() => {
    if ((btcConfirmations ?? 0) < 2) return;
    setStep(Step.Finalize);
  }, [btcConfirmations, setStep]);

  return (
    <>
      <Confirmation>
        <TransactionStatus>Deposit Received</TransactionStatus>
        {btcConfirmations && (
          <p>
            {btcConfirmations}/2 confirmations
            <Tooltip tip="Waiting for 2 confirmations" />
          </p>
        )}
      </Confirmation>
      <TransactionBox>
        <p>Your transaction has been received. Awaiting confirmation.</p>
        <Address href={getEtherscanLink(txAddress, 'transaction')}>
          {truncateAddress(txAddress)}
        </Address>
      </TransactionBox>
    </>
  );
};
