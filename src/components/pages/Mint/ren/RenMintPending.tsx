import React, { FC } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import { Step } from './types';
import { useRenMintStep, useRenMintState } from './RenMintProvider';
import { useRenDispatch, useRenState } from '../../../../context/RenProvider';
import { ADDRESSES } from '../../../../constants';
import { useThemeMode } from '../../../../context/AppProvider';
import { Tooltip } from '../../../core/ReactTooltip';
import { getEtherscanLink, truncateAddress } from '../../../../utils/strings';
import { ExternalLink } from '../../../core/ExternalLink';

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
  const state = useRenMintState();
  const [_, setStep] = useRenMintStep();

  const { start, remove, restore } = useRenDispatch();
  const { current, lockAndMint, storage, fees } = useRenState();

  const {
    inputFormValue,
    inputAddressOptions,
    inputAddress,
    outputAddress,
    outputAddressOptions,
  } = state?.onboardData ?? {};

  const onCancelClick = (): void => {};

  const txAddress =
    '0x79ee804f27c9724fcb4181b0e43de8ad1dbca198b1323a21156336eae23cba32';

  return (
    <>
      <Confirmation>
        <TransactionStatus>Deposit Received</TransactionStatus>
        <p>
          1/30 confirmations
          <Tooltip tip="Waiting for 30 confirmations" />
        </p>
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
