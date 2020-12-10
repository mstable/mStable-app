import React, {
  createContext,
  FC,
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import { BigNumber } from 'ethers/utils';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { State, Dispatch, StepProps } from './types';
import { Interfaces } from '../../../../types';
import { useSetFormManifest } from '../../../forms/TransactionForm/FormProvider';
import {
  useSelectedSaveV1Contract,
  useSelectedSaveV2Contract,
  useErc20Contract,
} from '../../../../web3/hooks';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { SavingsContract } from '../../../../typechain/SavingsContract.d';
import { Erc20Detailed } from '../../../../typechain/Erc20Detailed.d';
import { useWalletAddress } from '../../../../context/OnboardProvider';

const stateCtx = createContext<State>({} as never);
const dispatchCtx = createContext<Dispatch>({} as never);

export const SaveMigrationProvider: FC = ({ children }) => {
  const selectedMasset = useSelectedMassetState();
  const walletAddress = useWalletAddress();
  const savingsContractV1 = useSelectedSaveV1Contract();
  const savingsContractV2 = useSelectedSaveV2Contract();
  const [isWithdrawPending, setIsWithdrawPending] = useState(false);
  const [isApprovePending, setIsApprovePending] = useState(false);
  const [isDepositPending, setIsDepositPending] = useState(false);
  const tokenContract = useErc20Contract(savingsContractV2?.address);
  const setFormManifest = useSetFormManifest();

  const withdrawTx = useCallback(
    (amount: BigDecimal) => {
      const body = `${amount.format()}`;
      setFormManifest<Interfaces.SavingsContract, 'redeem'>({
        iface: savingsContractV1 as SavingsContract,
        args: [amount.exact],
        fn: 'redeem',
        purpose: {
          present: `Withdrawing ${body}`,
          past: `Withdrew ${body}`,
        },
        onSent() {
          setIsWithdrawPending(true);
        },
        onFinalize() {
          setIsWithdrawPending(false);
        },
      });
    },
    [setFormManifest, savingsContractV1],
  );
  const approveTx = useCallback(
    (spender: string, approveAmount: BigDecimal) => {
      setFormManifest<Interfaces.ERC20, 'approve'>({
        args: [spender, approveAmount.exact as BigNumber],
        fn: 'approve',
        iface: tokenContract as Erc20Detailed,
        purpose: {
          present: `Approve transfer${
            selectedMasset?.savingsContracts.v2?.token
              ? ` of ${selectedMasset?.savingsContracts.v2.token.symbol}`
              : ''
          }`,
          past: `Approved transfer${
            selectedMasset?.savingsContracts.v2?.token
              ? ` of ${selectedMasset?.savingsContracts.v2.token.symbol}`
              : ''
          }`,
        },
        onSent() {
          setIsApprovePending(true);
        },
        onFinalize() {
          setIsApprovePending(false);
        },
      });
    },
    [setFormManifest, tokenContract, selectedMasset],
  );
  const depositTx = useCallback(
    (amount: BigDecimal, spender: string) => {
      const body = `${amount.format()}`;
      setFormManifest<Interfaces.SavingsContract, 'deposit'>({
        iface: savingsContractV2 as SavingsContract,
        args: [amount.exact, spender],
        fn: 'deposit',
        purpose: {
          present: `Depositing ${body}`,
          past: `Deposited ${body}`,
        },
        onSent() {
          setIsDepositPending(true);
        },
        onFinalize() {
          setIsDepositPending(false);
        },
      });
    },
    [setFormManifest, savingsContractV2],
  );
  const state = useMemo(() => {
    return [
      {
        title: 'withdraw',
        buttonTitle: 'Submit',
        key: 'withdraw',
        isCompleted: selectedMasset?.savingsContracts.v1?.savingsBalance.balance?.exact.eq(
          0,
        ),
        isPending: isWithdrawPending,
        onClick: () =>
          withdrawTx(
            selectedMasset?.savingsContracts.v1?.savingsBalance
              .balance as BigDecimal,
          ),
      },
      {
        title: 'approve',
        buttonTitle: 'Exact',
        key: 'approve',
        isCompleted: selectedMasset?.savingsContracts.v2?.token?.allowances[
          selectedMasset?.savingsContracts.v2?.address
        ]?.exact.gte(
          selectedMasset?.savingsContracts.v1?.savingsBalance.balance
            ?.exact as BigNumber,
        ),
        isPending: isApprovePending,
        onClick: () =>
          approveTx(
            selectedMasset?.savingsContracts.v2?.address as string,
            selectedMasset?.savingsContracts.v1?.savingsBalance
              .balance as BigDecimal,
          ),
      },
      {
        title: 'deposit',
        buttonTitle: 'Submit',
        key: 'submit',
        isCompleted: selectedMasset?.savingsContracts.v1?.savingsBalance.balance?.exact.eq(
          0,
        ),
        isPending: isDepositPending,
        onClick: () =>
          depositTx(
            selectedMasset?.savingsContracts.v1?.savingsBalance
              .balance as BigDecimal,
            walletAddress as string,
          ),
      },
    ] as StepProps[];
  }, [
    selectedMasset,
    isWithdrawPending,
    isApprovePending,
    isDepositPending,
    walletAddress,
    approveTx,
    depositTx,
    withdrawTx,
  ]);
  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ withdrawTx, approveTx, depositTx }), [
          withdrawTx,
          approveTx,
          depositTx,
        ])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMigrationSteps = (): State => useContext(stateCtx);

export const useWithdrawTx = (): Dispatch['withdrawTx'] =>
  useContext(dispatchCtx).withdrawTx;

export const useApproveTx = (): Dispatch['approveTx'] =>
  useContext(dispatchCtx).approveTx;

export const useDepositTx = (): Dispatch['depositTx'] =>
  useContext(dispatchCtx).depositTx;
