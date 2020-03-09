import { useEffect, useMemo, useRef, useState } from 'react';
import { useWallet } from 'use-wallet';
import { useSignerContext } from '../context/SignerProvider';
import { ERC20DetailedFactory } from '../typechain/ERC20DetailedFactory';
import { useTokensContext } from '../context/TokensProvider';
import { ERC20Detailed } from '../typechain/ERC20Detailed.d';

interface State {
  [tokenAddress: string]: ERC20Detailed;
}

/**
 * Updater for tracking token balances, performing fetches on each new
 * block, and keeping contract instances in state.
 */
export const TokensUpdater = (): null => {
  const [tokens, { reset, updateBalances }] = useTokensContext();
  const signer = useSignerContext();

  const [contracts, setContracts] = useState<State>({});

  const { account, getBlockNumber } = useWallet();
  const accountRef = useRef<string | null>(account);

  const blockNumber = getBlockNumber();
  const blockNumberRef = useRef<number>(blockNumber);

  const subscribedTokens = useMemo(
    () =>
      Object.keys(tokens)
        .filter(token => tokens[token].subscribed)
        .sort(),
    [tokens],
  );

  // Set contract instances based on subscribed tokens.
  useEffect(() => {
    if (!signer) return;

    const newContracts = subscribedTokens.reduce(
      (_contracts, token) => ({
        ..._contracts,
        [token]: ERC20DetailedFactory.connect(token, signer),
      }),
      {},
    );
    setContracts(newContracts);
  }, [signer, subscribedTokens]);

  // Update subscribed balances on each block.
  useEffect(() => {
    if (account && blockNumberRef.current !== blockNumber) {
      const balancePromises = subscribedTokens
        .filter(token => contracts[token])
        .map(async token => {
          const balance = await contracts[token].balanceOf(account);
          return [token, balance];
        });

      Promise.all(balancePromises).then(result => {
        const newBalances = result.reduce(
          (_balances, [token, balance]) => ({
            ..._balances,
            [token as string]: balance,
          }),
          {},
        );
        updateBalances(newBalances);
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
      setContracts({});
      reset();
      accountRef.current = account;
    }
  }, [account, accountRef, reset]);

  return null;
};
