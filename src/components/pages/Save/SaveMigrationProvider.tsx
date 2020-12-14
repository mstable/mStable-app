import React, {
  createContext,
  FC,
  useMemo,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { BigNumber } from 'ethers/utils';
import { MaxUint256 } from 'ethers/constants';

import { Erc20Detailed } from '../../../typechain/Erc20Detailed.d';
import { SavingsContract } from '../../../typechain/SavingsContract.d';
import { useWalletAddress } from '../../../context/OnboardProvider';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { Interfaces, SendTxManifest } from '../../../types';
import {
  useDispatchCtx as useFormDispatch,
  useFormSubmitting,
  useManifest,
} from '../../forms/TransactionForm/FormProvider';
import {
  useSelectedSaveV1Contract,
  useSelectedSaveV2Contract,
  useSelectedMassetContract,
} from '../../../web3/hooks';
import { StepProps } from '../../core/Step';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { useTokenAllowance } from '../../../context/TokensProvider';

const stepsCtx = createContext<StepProps[]>([]);

export const SaveMigrationProvider: FC = ({ children }) => {
  const [approveInfinite, setApproveInfinite] = useState<boolean>(true);

  const sendTransaction = useSendTransaction();
  const { submitStart, submitEnd, setManifest } = useFormDispatch();
  const manifest = useManifest();
  const submitting = useFormSubmitting();

  const massetState = useSelectedMassetState();
  const massetSymbol = massetState?.token.symbol;
  const v1SavingsBalance = massetState?.savingsContracts.v1?.savingsBalance;
  const v2Address = massetState?.savingsContracts.v2?.address;

  const walletAddress = useWalletAddress();
  const savingsContractV1 = useSelectedSaveV1Contract();
  const savingsContractV2 = useSelectedSaveV2Contract();
  const massetContract = useSelectedMassetContract();
  useTokenAllowance(massetState?.address, v2Address);

  const startTx = useCallback(() => {
    if (manifest) {
      submitStart();
      sendTransaction({ ...manifest, onSent: submitEnd, onError: submitEnd });
    }
  }, [sendTransaction, submitStart, submitEnd, manifest]);

  const startApprovalTx = useCallback(
    (infinite: boolean) => () => {
      setApproveInfinite(infinite);
      startTx();
    },
    [startTx],
  );

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

    return [
      {
        key: 'withdraw',
        complete: !!v1.savingsBalance.balance?.exact.eq(0),
        options: [
          {
            title: 'Withdraw from Save V1',
            key: 'withdraw',
            onClick: startTx,
            pending: submitting,
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
            onClick: startApprovalTx(false),
            pending: submitting && !approveInfinite,
          },
          {
            title: 'Approve',
            key: 'approve-infinite',
            buttonTitle: 'Infinite',
            onClick: startApprovalTx(true),
            pending: submitting && approveInfinite,
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
            onClick: startTx,
            pending: submitting,
          },
        ],
      },
    ];
  }, [massetState, startTx, startApprovalTx, submitting, approveInfinite]);

  // First non-completed step
  const [currentStep] = steps.filter(_step => !_step.complete);
  const currentStepKey = currentStep?.key;

  useEffect(() => {
    // eslint-disable-next-line
    let manifest: SendTxManifest<any, any> | null = null;

    switch (currentStepKey) {
      case 'withdraw': {
        if (!(v1SavingsBalance?.balance && v1SavingsBalance.credits)) return;

        const body = v1SavingsBalance.balance.format();
        manifest = {
          iface: savingsContractV1 as SavingsContract,
          args: [v1SavingsBalance?.credits?.exact as BigNumber],
          fn: 'redeem',
          purpose: {
            present: `Withdrawing ${body}`,
            past: `Withdrew ${body}`,
          },
        } as SendTxManifest<Interfaces.SavingsContract, 'redeem'>;
        break;
      }

      case 'approve': {
        if (!(v2Address && massetSymbol && v1SavingsBalance?.balance)) return;

        const body = `transfer of ${massetSymbol}`;
        manifest = {
          iface: massetContract as Erc20Detailed,
          args: [
            v2Address,
            approveInfinite
              ? MaxUint256
              : (v1SavingsBalance?.balance.exact as BigNumber),
          ],
          fn: 'approve',
          purpose: {
            present: `Approve ${body}`,
            past: `Approved ${body}`,
          },
        } as SendTxManifest<Interfaces.ERC20, 'approve'>;
        break;
      }

      case 'deposit': {
        if (!v1SavingsBalance?.balance) return;

        manifest = {
          iface: savingsContractV2 as SavingsContract,
          args: [v1SavingsBalance.balance.exact, walletAddress as string],
          fn: 'deposit',
          purpose: {
            present: `Depositing ${v1SavingsBalance.balance.format()}`,
            past: `Deposited ${v1SavingsBalance.balance.format()}`,
          },
        } as SendTxManifest<Interfaces.SavingsContract, 'deposit'>;
        break;
      }

      default:
        break;
    }

    setManifest(manifest);
  }, [
    approveInfinite,
    currentStepKey,
    massetContract,
    massetSymbol,
    savingsContractV1,
    savingsContractV2,
    setManifest,
    v1SavingsBalance,
    v2Address,
    walletAddress,
  ]);

  return <stepsCtx.Provider value={steps}>{children}</stepsCtx.Provider>;
};

export const useMigrationSteps = (): StepProps[] => useContext(stepsCtx);
