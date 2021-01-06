/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers/utils';
import { MaxUint256 } from 'ethers/constants';

import { useWalletAddress } from '../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useTokenAllowance } from '../../../context/TokensProvider';
import { useSelectedSavingsContractState } from '../../../context/SelectedSaveVersionProvider';
import {
  Transaction,
  useTransactionsDispatch,
  useTransactionsState,
} from '../../../context/TransactionsProvider';
import {
  useSelectedMassetContract,
  useSelectedSaveV1Contract,
  useSelectedSaveV2Contract,
} from '../../../web3/hooks';
import {
  TransactionManifest,
  TransactionStatus,
} from '../../../web3/TransactionManifest';
import { Interfaces } from '../../../types';
import { StepProps } from '../../core/Step';

const isTxPending = (
  transactions: Record<string, Transaction>,
  id?: string,
): boolean => {
  return !!(
    id &&
    transactions[id] &&
    [TransactionStatus.Pending, TransactionStatus.Sent].includes(
      transactions[id].status,
    )
  );
};

const stepsCtx = createContext<StepProps[]>([]);

const formId = 'saveMigration';

export const SaveMigrationProvider: FC = ({ children }) => {
  const [approveInfinite, setApproveInfinite] = useState<boolean>(true);
  const [withdrawId, setWithdrawId] = useState<string | undefined>();
  const [approveId, setApproveId] = useState<string | undefined>();
  const [depositId, setDepositId] = useState<string | undefined>();

  const { propose } = useTransactionsDispatch();
  const transactions = useTransactionsState();
  const massetState = useSelectedMassetState();
  const massetSymbol = massetState?.token.symbol;
  const v1SavingsBalance = massetState?.savingsContracts.v1?.savingsBalance;
  const v2Address = massetState?.savingsContracts.v2?.address;

  const walletAddress = useWalletAddress();
  const savingsContractV1 = useSelectedSaveV1Contract();
  const savingsContractV2 = useSelectedSaveV2Contract();
  const massetContract = useSelectedMassetContract();
  const savingsContractState = useSelectedSavingsContractState();
  useTokenAllowance(massetState?.address, v2Address);

  const proposeWithdrawTx = useCallback(() => {
    if (
      !(
        v1SavingsBalance?.balance &&
        v1SavingsBalance.credits &&
        savingsContractV1
      )
    ) {
      return;
    }

    const body = v1SavingsBalance.balance.format();
    const tx = new TransactionManifest<Interfaces.SavingsContract, 'redeem'>(
      savingsContractV1,
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
      massetContract,
      'approve',
      [
        v2Address,
        approveInfinite
          ? MaxUint256
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

  const proposeDepositTx = useCallback(() => {
    if (!v1SavingsBalance?.balance || !savingsContractV2) {
      return;
    }

    const tx =
      savingsContractState?.version === 2 && !savingsContractState.current
        ? new TransactionManifest<Interfaces.SavingsContract, 'preDeposit'>(
            savingsContractV2,
            'preDeposit',
            [v1SavingsBalance.balance.exact, walletAddress as string],
            {
              present: `Pre depositing ${v1SavingsBalance.balance.format()}`,
              past: `Pre deposited ${v1SavingsBalance.balance.format()}`,
            },
            formId,
          )
        : new TransactionManifest<
            Interfaces.SavingsContract,
            'depositSavings(uint256,address)'
          >(
            savingsContractV2,
            'depositSavings(uint256,address)',
            [v1SavingsBalance.balance.exact, walletAddress as string],
            {
              present: `Depositing ${v1SavingsBalance.balance.format()}`,
              past: `Deposited ${v1SavingsBalance.balance.format()}`,
            },
            formId,
          );

    setDepositId(tx.id);
    propose(tx);
  }, [
    propose,
    savingsContractState,
    savingsContractV2,
    v1SavingsBalance,
    walletAddress,
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

    const approveComplete = massetState.token.allowances[v2.address]?.exact.gte(
      v1.savingsBalance.balance?.exact as BigNumber,
    );

    const withdrawTxSubmitting = isTxPending(transactions, withdrawId);
    const depositTxSubmitting = isTxPending(transactions, depositId);
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
            key: 'deposit',
            onClick: proposeDepositTx,
            pending: depositTxSubmitting,
          },
        ],
      },
    ];
  }, [
    approveId,
    approveInfinite,
    depositId,
    massetState,
    proposeApproveTx,
    proposeDepositTx,
    proposeWithdrawTx,
    transactions,
    withdrawId,
  ]);

  return <stepsCtx.Provider value={steps}>{children}</stepsCtx.Provider>;
};

export const useMigrationSteps = (): StepProps[] => useContext(stepsCtx);
