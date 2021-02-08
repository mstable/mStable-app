import { Reducer, useEffect, useReducer } from 'react';
import { usePrevious } from 'react-use';
import { Interface } from 'ethers/utils/interface';
import { Provider } from 'ethers/providers';

import { useBlockNumber } from '../context/BlockProvider';
import { useAccount } from '../context/UserProvider';
import {
  useAllowanceSubscriptionsSerialized,
  useBalanceSubscriptionsSerialized,
  useTokensDispatch,
} from '../context/TokensProvider';
import { useSigner } from '../context/OnboardProvider';
import {
  Erc20Detailed,
  Erc20DetailedInterface,
} from '../typechain/Erc20Detailed.d';
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

const contractInterface = (() => {
  const abi = [
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ];
  return new Interface(abi) as Erc20DetailedInterface;
})();

/**
 * Updater for tracking token balances, performing fetches on each new
 * block, and keeping contract instances in state.
 */
export const TokenSubscriptionsUpdater = (): null => {
  const { reset, updateBalances, updateAllowances } = useTokensDispatch();
  const signer = useSigner();

  const [contracts, dispatch] = useReducer(reducer, initialState);

  const account = useAccount();
  const prevAccount = usePrevious(account);
  const blockNumber = useBlockNumber();

  const balanceSubscriptionsSerialized = useBalanceSubscriptionsSerialized();
  const allowanceSubscriptionsSerialized = useAllowanceSubscriptionsSerialized();

  // Clear all contracts and tokens if the account changes.
  useEffect(() => {
    if (prevAccount !== account || !account) {
      dispatch({ type: Actions.Reset });
      reset();
    }
  }, [account, prevAccount, reset]);

  useEffect(() => {
    if (account && signer && signer.provider) {
      const allowanceSubs: {
        address: string;
        spenders: string[];
        decimals: number;
      }[] = JSON.parse(allowanceSubscriptionsSerialized);

      const allowancePromises = allowanceSubs.flatMap(
        ({ address, spenders, decimals }) =>
          spenders.map(async spender => {
            const data = await (signer.provider as Provider).call({
              to: address,
              data: contractInterface.functions.allowance.encode([
                account,
                spender,
              ]),
            });
            const allowance = contractInterface.functions.allowance.decode(
              data,
            );
            return {
              address,
              spender,
              allowance: new BigDecimal(allowance[0], decimals),
            };
          }),
      );

      Promise.all(allowancePromises)
        .then(allowances => {
          updateAllowances(
            allowances.reduce<Parameters<typeof updateAllowances>[0]>(
              (_allowances, { address, allowance, spender }) => ({
                ..._allowances,
                [address]: { ..._allowances[address], [spender]: allowance },
              }),
              {},
            ),
          );
        })
        .catch(console.error);
    }
  }, [
    account,
    allowanceSubscriptionsSerialized,
    blockNumber,
    contracts,
    signer,
    updateAllowances,
  ]);

  useEffect(() => {
    if (account && signer && signer.provider) {
      const balanceSubs: { address: string; decimals: number }[] = JSON.parse(
        balanceSubscriptionsSerialized,
      );

      const balancePromises = balanceSubs.map(async ({ address, decimals }) => {
        const data = await (signer.provider as Provider).call({
          to: address,
          data: contractInterface.functions.balanceOf.encode([account]),
        });
        const balance = contractInterface.functions.balanceOf.decode(data);
        return [address, new BigDecimal(balance[0], decimals)];
      });

      Promise.all(balancePromises)
        .then(balances => {
          updateBalances(Object.fromEntries(balances));
        })
        .catch(console.error);
    }
  }, [
    account,
    balanceSubscriptionsSerialized,
    blockNumber,
    contracts,
    signer,
    updateBalances,
  ]);

  return null;
};
