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
import { State, Dispatch } from './types';
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

const stateCtx = createContext<State>({} as State);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const SaveMigrationProvider: FC = ({ children }) => {
  const selectedMasset = useSelectedMassetState();
  const savingsContractV1 = useSelectedSaveV1Contract();
  const savingsContractV2 = useSelectedSaveV2Contract();
  const [isWithdrawPending, setIsWithdrawPending] = useState(false);
  const [isApprovePending, setIsApprovePending] = useState(false);
  const [isDepositPending, setIsDepositPending] = useState(false);
  const setFormManifest = useSetFormManifest();
  const tokenContract = useErc20Contract(savingsContractV2?.address);
  const state = useMemo(() => {
    const withdraw = {
      isCompleted: selectedMasset?.savingsContracts.v1?.savingsBalance.balance?.exact.eq(
        0,
      ),
      isWithdrawPending,
    };
    const approve = {
      isCompleted: selectedMasset?.savingsContracts.v2?.token?.allowances[
        selectedMasset?.savingsContracts.v2?.address
      ]?.exact.gte(
        selectedMasset?.savingsContracts.v1?.savingsBalance.balance
          ?.exact as BigNumber,
      ),
      isApprovePending,
    };
    const deposit = {
      isCompleted: selectedMasset?.savingsContracts.v2?.savingsBalance?.balance?.exact.eq(
        selectedMasset?.savingsContracts.v1?.savingsBalance.balance
          ?.exact as BigNumber,
      ),
      isDepositPending,
    };
    return { withdraw, approve, deposit } as State;
  }, [selectedMasset, isWithdrawPending, isApprovePending, isDepositPending]);

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
    (amount: BigDecimal, walletAddress: string) => {
      const body = `${amount.format()}`;
      setFormManifest<Interfaces.SavingsContract, 'deposit'>({
        iface: savingsContractV2 as SavingsContract,
        args: [amount.exact, walletAddress],
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

export const useMigrationState = (): State['state'] =>
  useContext(stateCtx).state;

export const useWithdrawTx = (): Dispatch['withdrawTx'] =>
  useContext(dispatchCtx).withdrawTx;

export const useApproveTx = (): Dispatch['approveTx'] =>
  useContext(dispatchCtx).approveTx;

export const useDepositTx = (): Dispatch['depositTx'] =>
  useContext(dispatchCtx).depositTx;
