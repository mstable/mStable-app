import { useEffect, useRef, useReducer, Reducer } from 'react';
import { useWallet } from 'use-wallet';
import { useSignerContext } from '../context/SignerProvider';
// import { ERC20DetailedFactory } from '../typechain/ERC20DetailedFactory';
import {
  useSubscribedTokens,
  useTokensDispatch,
} from '../context/TokensProvider';
import { ERC20Detailed } from '../typechain/ERC20Detailed.d';

interface State {
  [tokenAddress: string]: ERC20Detailed;
}

enum Actions {
  SetContracts,
  Reset,
}

type Action =
  | {
      type: Actions.SetContracts;
      payload: Record<string, ERC20Detailed>;
    }
  | { type: Actions.Reset };

const initialState: State = {};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetContracts:
      return { ...state, ...action.payload };
    case Actions.Reset:
      return {};
    default:
      throw new Error('Unhandled action type');
  }
};

/**
 * Updater for tracking token balances, performing fetches on each new
 * block, and keeping contract instances in state.
 */
export const TokenBalancesUpdater = (): null => {
  const { reset, updateBalances } = useTokensDispatch();
  const signer = useSignerContext();

  const [contracts, dispatch] = useReducer(reducer, initialState);

  const { account, getBlockNumber } = useWallet();
  const accountRef = useRef<string | null>(account);

  const blockNumber = getBlockNumber();
  const blockNumberRef = useRef<number>(blockNumber);

  const subscribedTokens = useSubscribedTokens();

  // Tokens which are subscribed to, but don't have contract instances.
  const missing = useRef<string[]>([]);
  useEffect(() => {
    missing.current = subscribedTokens.filter(token => !contracts[token]);
  }, [subscribedTokens, contracts]);

  // Set missing contract instances.
  useEffect(() => {
    if (!signer || missing.current.length === 0) return;

    // const instances = missing.current.reduce(
    //   (_contracts, token) => ({
    //     ..._contracts,
    //     [token]: ERC20DetailedFactory.connect(token, signer),
    //   }),
    //   {},
    // );
    // TODO re-enable when fake data is removed
    const instances = {};

    dispatch({ type: Actions.SetContracts, payload: instances });
  }, [signer, missing]);

  // Update subscribed balances on each block.
  useEffect(() => {
    if (account && blockNumberRef.current !== blockNumber) {
      const balancePromises = subscribedTokens
        .filter(token => contracts[token])
        .map(async token => ({
          [token]: await contracts[token].balanceOf(account),
        }));

      Promise.all(balancePromises).then(result => {
        updateBalances(result.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
        blockNumberRef.current = blockNumber;
      });
    }
  }, [
    account,
    blockNumber,
    blockNumberRef,
    contracts,
    subscribedTokens,
    updateBalances,
  ]);

  // Clear all contracts and tokens if the account changes.
  useEffect(() => {
    if (accountRef.current !== account) {
      dispatch({ type: Actions.Reset });
      reset();
      accountRef.current = account;
    }
  }, [account, accountRef, reset]);

  return null;
};
