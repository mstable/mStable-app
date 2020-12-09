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
import { State } from './types';
import { Interfaces } from '../../../../types';
// import { MassetState } from '../../../../context/DataProvider/types';
import { useSetFormManifest } from '../../../forms/TransactionForm/FormProvider';
import {
  useSelectedSaveV1Contract,
  useSelectedSaveV2Contract,
  useErc20Contract,
} from '../../../../web3/hooks';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { SavingsContract } from '../../../../typechain/SavingsContract.d';
import { Erc20Detailed } from '../../../../typechain/Erc20Detailed.d';

const stateCtx = createContext<State>({} as never);

export const SaveMigrationProvider: FC = ({ children }) => {
  const selectedMasset = useSelectedMassetState();
  const savingsContractV1 = useSelectedSaveV1Contract();
  const savingsContractV2 = useSelectedSaveV2Contract();
  const [isPending, setIsPending] = useState(false);
  const setFormManifest = useSetFormManifest();
  const tokenContract = useErc20Contract(savingsContractV2?.address);
  const state = useMemo(() => {
    const withdraw = {
      isCompleted: selectedMasset?.savingsContracts.v1?.savingsBalance.balance?.exact.eq(
        0,
      ),
      isPending,
    };
    const approve = {
      isCompleted: selectedMasset?.savingsContracts.v2?.token?.allowances[
        selectedMasset?.savingsContracts.v2?.address
      ]?.exact.gte(
        selectedMasset?.savingsContracts.v1?.savingsBalance.balance
          ?.exact as BigNumber,
      ),
      isPending,
    };
    const deposit = {
      isCompleted: selectedMasset?.savingsContracts.v2?.savingsBalance?.balance?.exact.eq(
        selectedMasset?.savingsContracts.v1?.savingsBalance.balance
          ?.exact as BigNumber,
      ),
      isPending,
    };
    return { withdraw, approve, deposit };
  }, [selectedMasset, isPending]);

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
          setIsPending(true);
        },
        onFinalize() {
          setIsPending(false);
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
          setIsPending(true);
        },
        onFinalize() {
          setIsPending(false);
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
          setIsPending(true);
        },
        onFinalize() {
          setIsPending(false);
        },
      });
    },
    [setFormManifest, savingsContractV2],
  );

  return (
    <stateCtx.Provider
      value={useMemo(() => ({ state, withdrawTx, approveTx, depositTx }), [
        state,
        withdrawTx,
        approveTx,
        depositTx,
      ])}
    >
      {children}
    </stateCtx.Provider>
  );
};

export const useMigrationState = (): State['state'] =>
  useContext(stateCtx).state;

export const useWithdrawTx = (): State['withdrawTx'] =>
  useContext(stateCtx).withdrawTx;

export const useApproveTx = (): State['approveTx'] =>
  useContext(stateCtx).approveTx;

export const useDepositTx = (): State['depositTx'] =>
  useContext(stateCtx).depositTx;
