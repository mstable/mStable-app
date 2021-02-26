/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

import { BigNumber, constants } from 'ethers';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenAllowance } from '../../../../context/TokensProvider';
import {
  Transaction,
  useTransactionsDispatch,
  useTransactionsState,
} from '../../../../context/TransactionsProvider';
import {
  useSelectedLegacyMassetContract,
  useSelectedSaveV1Contract,
} from '../../../../web3/hooks';
import {
  TransactionManifest,
  TransactionStatus,
} from '../../../../web3/TransactionManifest';
import { Interfaces } from '../../../../types';
import { StepProps } from '../../../core/Step';
import { useModalComponent } from '../../../../hooks/useModalComponent';
import { MassetModal } from '../v2/MassetModal';
import { ReactComponent as MUSDIcon } from '../../../icons/tokens/mUSD.svg';

const isTxPending = (
  transactions: Record<string, Transaction>,
  id?: string,
): boolean => {
  return !!(
    id &&
    transactions[id] &&
    [
      TransactionStatus.Pending,
      TransactionStatus.Sent,
      TransactionStatus.Response,
    ].includes(transactions[id].status)
  );
};

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > svg {
    width: 2rem;
    height: auto;
  }
`;

const stepsCtx = createContext<StepProps[]>([]);

const formId = 'saveMigration';

export const SaveMigrationProvider: FC = ({ children }) => {
  const [approveInfinite, setApproveInfinite] = useState<boolean>(true);
  const [withdrawId, setWithdrawId] = useState<string | undefined>();
  const [approveId, setApproveId] = useState<string | undefined>();

  const { propose } = useTransactionsDispatch();
  const transactions = useTransactionsState();
  const massetState = useSelectedMassetState();
  const massetSymbol = massetState?.token.symbol;
  const v1SavingsBalance = massetState?.savingsContracts.v1?.savingsBalance;
  const v2Address = massetState?.savingsContracts.v2?.address;

  const savingsContractV1 = useSelectedSaveV1Contract();
  const massetContract = useSelectedLegacyMassetContract();

  const allowance = useTokenAllowance(massetState?.address, v2Address);

  const [showDepositModal] = useModalComponent({
    title: (
      <ModalTitle>
        <MUSDIcon />
        mUSD
      </ModalTitle>
    ),
    children: <MassetModal />,
  });

  const proposeWithdrawTx = useCallback(() => {
    if (
      !(
        v1SavingsBalance?.balance &&
        v1SavingsBalance.credits?.exact.gt(0) &&
        savingsContractV1
      )
    ) {
      return;
    }

    const body = v1SavingsBalance.balance.format();
    const tx = new TransactionManifest<Interfaces.SavingsContract, 'redeem'>(
      savingsContractV1 as never,
      'redeem',
      [v1SavingsBalance?.credits?.exact as BigNumber],
      {
        present: `Withdrawing ${body}`,
        past: `Withdrew ${body}`,
      },
      formId,
    );

    setWithdrawId(tx.id);
    propose(tx);
  }, [propose, savingsContractV1, v1SavingsBalance]);

  const proposeApproveTx = useCallback(() => {
    if (
      !(
        v2Address &&
        massetSymbol &&
        v1SavingsBalance?.balance &&
        massetContract
      )
    ) {
      return;
    }

    const body = `transfer of ${massetSymbol}`;
    const tx = new TransactionManifest<Interfaces.ERC20, 'approve'>(
      massetContract as never,
      'approve',
      [
        v2Address,
        approveInfinite
          ? constants.MaxUint256
          : (v1SavingsBalance?.balance.exact as BigNumber),
      ],
      {
        present: `Approving ${body}`,
        past: `Approved ${body}`,
      },
      formId,
    );

    setApproveId(tx.id);
    propose(tx);
  }, [
    approveInfinite,
    massetContract,
    massetSymbol,
    propose,
    v1SavingsBalance,
    v2Address,
  ]);

  const steps = useMemo<StepProps[]>(() => {
    if (
      !(
        massetState &&
        massetState.savingsContracts.v1 &&
        massetState.savingsContracts.v2?.token
      )
    ) {
      return [];
    }

    const { v1, v2 } = massetState.savingsContracts;

    const approveComplete =
      allowance?.exact.gte(massetState.token.balance?.exact as BigNumber) ??
      false;

    const withdrawTxSubmitting = isTxPending(transactions, withdrawId);
    const approveTxSubmitting = isTxPending(transactions, approveId);

    return [
      {
        key: 'withdraw',
        complete: !!v1.savingsBalance.balance?.exact.eq(0),
        options: [
          {
            title: 'Withdraw from Save V1',
            key: 'withdraw',
            onClick: proposeWithdrawTx,
            pending: withdrawTxSubmitting,
          },
        ],
      },
      {
        key: 'approve',
        complete: approveComplete,
        options: [
          {
            title: 'Approve',
            key: 'approve-exact',
            buttonTitle: 'Exact',
            onClick: () => {
              setApproveInfinite(false);
              proposeApproveTx();
            },
            pending: approveTxSubmitting && !approveInfinite,
          },
          {
            title: 'Approve',
            key: 'approve-infinite',
            buttonTitle: 'Infinite',
            onClick: () => {
              setApproveInfinite(true);
              proposeApproveTx();
            },
            pending: approveTxSubmitting && approveInfinite,
          },
        ],
      },
      {
        key: 'deposit',
        complete: !!(
          v1.savingsBalance.balance?.exact.eq(0) &&
          v2.savingsBalance.balance?.exact.gt(0)
        ),
        options: [
          {
            title: 'Deposit to Save V2',
            buttonTitle: 'Deposit',
            key: 'deposit',
            onClick: showDepositModal,
            pending: false,
          },
        ],
      },
    ];
  }, [
    allowance?.exact,
    approveId,
    approveInfinite,
    massetState,
    proposeApproveTx,
    proposeWithdrawTx,
    showDepositModal,
    transactions,
    withdrawId,
  ]);

  return <stepsCtx.Provider value={steps}>{children}</stepsCtx.Provider>;
};

export const useMigrationSteps = (): StepProps[] => useContext(stepsCtx);
