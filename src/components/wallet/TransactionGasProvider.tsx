import React, {
  createContext,
  FC,
  SetStateAction,
  Dispatch,
  useState,
  useContext,
  useMemo,
} from 'react';
import { useThrottleFn } from 'react-use';
import { BigNumber } from 'ethers/utils';

import {
  Transaction,
  useTransactionsState,
} from '../../context/TransactionsProvider';

interface GasCtx {
  gasLimit?: BigNumber;
  gasPrice?: number;
  setGasPrice: Dispatch<SetStateAction<number | undefined>>;
}

const ctx = createContext<GasCtx>(null as never);

export const useGas = (): GasCtx => useContext(ctx);

export const TransactionGasProvider: FC<{ id: string }> = ({
  children,
  id,
}) => {
  const { [id]: transaction } = useTransactionsState();
  const [gasLimit, setGasLimit] = useState<BigNumber | undefined>();
  const [gasPrice, setGasPrice] = useState<number | undefined>();

  useThrottleFn<Promise<void>, [Transaction | undefined]>(
    async _transaction => {
      let estimate: BigNumber | undefined;
      if (_transaction) {
        try {
          estimate = await _transaction.manifest.estimate();
        } catch (error) {
          console.error(error);
        }
      }
      setGasLimit(estimate);
    },
    5000,
    [transaction],
  );

  return (
    <ctx.Provider
      value={useMemo(() => ({ gasLimit, gasPrice, setGasPrice }), [
        gasLimit,
        gasPrice,
        setGasPrice,
      ])}
    >
      {children}
    </ctx.Provider>
  );
};
