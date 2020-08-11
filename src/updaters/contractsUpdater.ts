import { useEffect, useRef } from 'react';
import { useWallet } from 'use-wallet';
import { hexZeroPad } from 'ethers/utils';

import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { useAccount } from '../context/UserProvider';
import { getHistoricTransactions } from '../web3/getHistoricTransactions';
import {
  useMusdContract,
  useSavingsContract,
} from '../context/DataProvider/ContractsProvider';
import { useBlockNumber } from '../context/DataProvider/BlockProvider';

export const ContractsUpdater = (): null => {
  const { status, connector } = useWallet();
  const connected = status === 'connected';
  const account = useAccount();
  const { addHistoric, reset } = useTransactionsDispatch();

  const mUsdContract = useMusdContract();
  const savingsContract = useSavingsContract();

  const blockNumber = useBlockNumber();

  // Filter: 1000 blocks back (some providers can't handle more, and
  // this will be replace with The Graph soon anyway).
  const filter = useRef<{ fromBlock?: number }>();
  filter.current = blockNumber ? { fromBlock: blockNumber - 1000 } : {};

  /**
   * When the account changes, reset the transactions state.
   */
  useEffect(reset, [account, connector, connected, reset]);

  /**
   * When the account changes (and mUSD exists), get historic transactions.
   */
  useEffect(() => {
    if (mUsdContract && account && addHistoric) {
      const indexedAccount = hexZeroPad(account.toLowerCase(), 32);

      const {
        Minted,
        Swapped,
        Redeemed,
        RedeemedMasset,
        MintedMulti,
      } = mUsdContract.interface.events;

      const mUSDTopics: (string | null)[][] = [
        [Minted.topic, indexedAccount],
        [MintedMulti.topic, indexedAccount],
        [Redeemed.topic, indexedAccount],
        [RedeemedMasset.topic, indexedAccount],
        [Swapped.topic, indexedAccount],
      ];

      getHistoricTransactions(
        mUsdContract,
        account,
        mUSDTopics,
        filter.current,
      ).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, mUsdContract]);

  /**
   * When the account changes (and mUSDSavings exists), get historic transactions.
   */
  useEffect(() => {
    if (savingsContract && account && addHistoric) {
      const indexedAccount = hexZeroPad(account.toLowerCase(), 32);

      const {
        SavingsDeposited,
        CreditsRedeemed,
      } = savingsContract.interface.events;

      const mUSDSavingsTopics: (string | null)[][] = [
        [SavingsDeposited.topic, indexedAccount],
        [CreditsRedeemed.topic, indexedAccount],
      ];

      getHistoricTransactions(
        savingsContract,
        account,
        mUSDSavingsTopics,
        filter.current,
      ).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, savingsContract]);

  return null;
};
