import { Reducer, useEffect, useReducer, useRef } from 'react';
import { useSignerContext } from '../context/SignerProvider';
import { useBlockNumber } from '../context/DataProvider/BlockProvider';
import { useAccount } from '../context/UserProvider';
import {
  useAllowanceSubscriptionsSerialized,
  useBalanceSubscriptionsSerialized,
  useTokenSubscriptionsSerialized,
  useTokensDispatch,
} from '../context/DataProvider/TokensProvider';
import { Erc20DetailedFactory } from '../typechain/Erc20DetailedFactory';
import { Erc20Detailed } from '../typechain/Erc20Detailed.d';
import { BigDecimal } from '../web3/BigDecimal';

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
export const TokenSubscriptionsUpdater = (): null => {
  const { reset, updateBalances, updateAllowances } = useTokensDispatch();
  const signer = useSignerContext();

  const [contracts, dispatch] = useReducer(reducer, initialState);

  const account = useAccount();
  const accountRef = useRef<string | null>(account);
  const blockNumber = useBlockNumber();

  const tokenSubscriptionsSerialized = useTokenSubscriptionsSerialized();
  const balanceSubscriptionsSerialized = useBalanceSubscriptionsSerialized();
  const allowanceSubscriptionsSerialized = useAllowanceSubscriptionsSerialized();

  // Set contract instances based on subscribed tokens.
  useEffect(() => {
    if (!signer) return;

    const addresses: string[] = JSON.parse(tokenSubscriptionsSerialized);

    const instances = addresses.reduce(
      (_contracts, address) => ({
        ..._contracts,
        [address]: Erc20DetailedFactory.connect(address, signer),
      }),
      contracts,
    );

    dispatch({ type: Actions.SetContracts, payload: instances });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, tokenSubscriptionsSerialized]);

  useEffect(() => {
    if (account) {
      const balanceSubs: { address: string; decimals: number }[] = JSON.parse(
        balanceSubscriptionsSerialized,
      );

      const balancePromises = balanceSubs
        .filter(({ address }) => contracts[address])
        .map(async ({ address, decimals }) => ({
          [address]: new BigDecimal(
            await contracts[address].balanceOf(account),
            decimals as number,
          ),
        }));

      Promise.all(balancePromises)
        .then(balances => {
          updateBalances(
            balances.reduce(
              (_balances, balance) => ({ ..._balances, ...balance }),
              {},
            ),
          );
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.warn(error);
        });
    }
  }, [
    account,
    balanceSubscriptionsSerialized,
    blockNumber,
    contracts,
    updateBalances,
  ]);

  useEffect(() => {
    if (account) {
      const allowanceSubs: {
        address: string;
        spenders: string[];
        decimals: number;
      }[] = JSON.parse(allowanceSubscriptionsSerialized);

      const allowancePromises: Promise<{
        address: string;
        spender: string;
        allowance: BigDecimal;
      }>[] = allowanceSubs
        .filter(({ address }) => contracts[address])
        .flatMap(({ address, spenders, decimals }) =>
          spenders.map(async spender => ({
            address,
            spender,
            allowance: new BigDecimal(
              await contracts[address].allowance(account, spender),
              decimals,
            ),
          })),
        );

      Promise.all(allowancePromises).then(allowances => {
        updateAllowances(
          allowances.reduce<Parameters<typeof updateAllowances>[0]>(
            (_allowances, { address, allowance, spender }) => ({
              ..._allowances,
              [address]: { ..._allowances[address], [spender]: allowance },
            }),
            {},
          ),
        );
      });
    }
  }, [
    account,
    allowanceSubscriptionsSerialized,
    blockNumber,
    contracts,
    updateAllowances,
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
