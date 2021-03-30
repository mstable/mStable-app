import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { BigNumber, constants } from 'ethers';

import { useErc20Contract } from '../../web3/hooks';
import { BigDecimal } from '../../web3/BigDecimal';
import { TransactionManifest } from '../../web3/TransactionManifest';

import {
  useHasPendingApproval,
  useTransactionsDispatch,
} from '../../context/TransactionsProvider';
import {
  useTokenAllowance,
  useTokenSubscription,
} from '../../context/TokensProvider';
import { Interfaces } from '../../types';

export type Mode = 'exact' | 'infinite' | 'zero';

type HandleApprove = (mode: Mode) => void;

interface Approve {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  hasPendingApproval: boolean;
  isApproveEdgeCase: boolean;
  needsApprove: boolean;
}

const APPROVE_EDGE_CASES: Record<string, string> = {
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT', // Mainnet
  '0xb404c51bbc10dcbe948077f18a4b8e553d160084': 'USDT', // Ropsten
};

const INFINITE = new BigDecimal(constants.MaxUint256, 18);

const handleApproveCtx = createContext<HandleApprove>(null as never);

const approveCtx = createContext<Approve>(null as never);

export const useApprove = (): [Approve, HandleApprove] => [
  useContext(approveCtx),
  useContext(handleApproveCtx),
];

export const ApproveProvider: FC<{
  address: string;
  spender: string;
  amount?: BigDecimal;
}> = ({ address, spender, amount, children }) => {
  const contract = useErc20Contract(address);
  const hasPendingApproval = useHasPendingApproval(address, spender);
  const token = useTokenSubscription(address);
  const tokenSymbol = token?.symbol;
  const allowance = useTokenAllowance(address, spender);
  const { propose } = useTransactionsDispatch();

  const [mode, setMode] = useState<Mode>('infinite');

  const isApproveEdgeCase = !!(
    APPROVE_EDGE_CASES[address] &&
    amount &&
    allowance &&
    allowance.exact.gt(0) &&
    allowance.exact.lt(amount.exact)
  );

  const needsApprove =
    address !== spender && !!(allowance && amount?.exact.gt(allowance.exact));

  const handleApprove = (_mode: Mode): void => {
    setMode(_mode);

    const approveAmount =
      _mode === 'infinite'
        ? INFINITE
        : _mode === 'zero'
        ? new BigDecimal(0, amount?.decimals)
        : amount;

    if (!(contract && spender && approveAmount)) return;

    propose<Interfaces.ERC20, 'approve'>(
      new TransactionManifest(
        contract as never,
        'approve',
        [spender, approveAmount.exact as BigNumber],
        {
          present: `Approve transfer${tokenSymbol ? ` of ${tokenSymbol}` : ''}`,
          past: `Approved transfer${tokenSymbol ? ` of ${tokenSymbol}` : ''}`,
        },
      ),
    );
  };

  return (
    <handleApproveCtx.Provider value={handleApprove}>
      <approveCtx.Provider
        value={useMemo(
          () => ({
            mode,
            setMode,
            hasPendingApproval,
            isApproveEdgeCase,
            needsApprove,
          }),
          [mode, hasPendingApproval, isApproveEdgeCase, needsApprove],
        )}
      >
        {children}
      </approveCtx.Provider>
    </handleApproveCtx.Provider>
  );
};
