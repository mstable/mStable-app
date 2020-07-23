import {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { useWallet } from 'use-wallet';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useProviderContext } from '../context/EthereumProvider';
import { Erc20DetailedFactory } from '../typechain/Erc20DetailedContract';
import {
  useSubscribedTokens,
  useTokensDispatch,
} from '../context/DataProvider/TokensProvider';
import { Erc20Detailed } from '../typechain/Erc20Detailed.d';
import { useKnownAddress } from '../context/DataProvider/KnownAddressProvider';
import { useBlockNumber } from '../context/DataProvider/BlockProvider';
import { ContractNames } from '../types';
import { useAsyncMutex } from '../web3/hooks';

interface State {
  [tokenAddress: string]: Erc20Detailed;
}

enum Actions {
  SetContracts,
  Reset,
}

type Action =
  | {
      type: Actions.SetContracts;
      payload: Record<string, Erc20Detailed>;
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
  const { reset, updateBalances, updateAllowance } = useTokensDispatch();
  const provider = useProviderContext();
  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  const mUSD = useMemo(
    () =>
      mUSDAddress && provider
        ? Erc20DetailedFactory.connect(mUSDAddress, provider)
        : null,
    [mUSDAddress, provider],
  );

  const [contracts, dispatch] = useReducer(reducer, initialState);

  const { account } = useWallet();
  const accountRef = useRef<string | null>(account);

  const blockNumber = useBlockNumber();

  const subscribedTokens = useSubscribedTokens();

  // Set contract instances based on subscribed tokens.
  useDeepCompareEffect(() => {
    if (!provider) return;

    const instances = subscribedTokens.reduce(
      (_contracts, token) => ({
        ..._contracts,
        [token]: Erc20DetailedFactory.connect(token, provider),
      }),
      contracts,
    );

    dispatch({ type: Actions.SetContracts, payload: instances });
    // `contracts` dep intentionally left out because it's set here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, subscribedTokens]);

  const updateCallback = useCallback(async () => {
    if (account) {
      // Update balances
      const balancePromises = Object.keys(contracts)
        .filter(token => contracts[token] && token !== mUSDSavingsAddress)
        .map(async token => ({
          [token]: await contracts[token].balanceOf(account),
        }));

      // Update mUSD allowances
      if (mUSDAddress) {
        const allowancePromises = Object.keys(contracts)
          .filter(token => contracts[token] && token !== mUSDAddress)
          .map(async token => ({
            [token]: await contracts[token].allowance(account, mUSDAddress),
          }));

        if (mUSDSavingsAddress && mUSD) {
          mUSD.allowance(account, mUSDSavingsAddress).then(allowance => {
            updateAllowance(mUSDSavingsAddress, { [mUSDAddress]: allowance });
          });
        }

        Promise.all(allowancePromises).then(result => {
          updateAllowance(
            mUSDAddress,
            result.reduce((acc, obj) => ({ ...acc, ...obj }), {}),
          );
        });
      }

      Promise.all(balancePromises).then(result => {
        updateBalances(result.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
      });
    }
  }, [
    account,
    contracts,
    mUSDAddress,
    mUSD,
    mUSDSavingsAddress,
    updateAllowance,
    updateBalances,
  ]);

  // Update subscribed tokens on each block, and also if the account or number
  // of tokens changes
  useAsyncMutex(
    [account, blockNumber, mUSDAddress, Object.keys(contracts).length].join(),
    updateCallback,
  );

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
