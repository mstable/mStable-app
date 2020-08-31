import { useEffect, useRef } from 'react';
import { hexZeroPad } from 'ethers/utils';
import { useConnected } from '../context/OnboardProvider';
import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { useAccount } from '../context/UserProvider';
import { getHistoricTransactions } from '../web3/getHistoricTransactions';
import {
  useSelectedMassetContract,
  useSelectedMassetSavingsContract,
} from '../context/DataProvider/ContractsProvider';
import { useBlockNumber } from '../context/DataProvider/BlockProvider';

export const ContractsUpdater = (): null => {
  const connected = useConnected();
  const account = useAccount();
  const { addHistoric, reset } = useTransactionsDispatch();

  const massetContract = useSelectedMassetContract();
  const savingsContract = useSelectedMassetSavingsContract();

  const blockNumber = useBlockNumber();

  // Filter: 1000 blocks back (some providers can't handle more, and
  // this will be replace with The Graph soon anyway).
  const filter = useRef<{ fromBlock?: number }>();
  filter.current = blockNumber ? { fromBlock: blockNumber - 1000 } : {};

  /**
   * When the account changes, reset the transactions state.
   */
  useEffect(reset, [account, connected, reset]);

  /**
   * When the account changes (and mUSD exists), get historic transactions.
   */
  useEffect(() => {
    if (massetContract && account && addHistoric) {
      const indexedAccount = hexZeroPad(account.toLowerCase(), 32);

      const {
        Minted,
        Swapped,
        Redeemed,
        RedeemedMasset,
        MintedMulti,
      } = massetContract.interface.events;

      const massetTopics: (string | null)[][] = [
        [Minted.topic, indexedAccount],
        [MintedMulti.topic, indexedAccount],
        [Redeemed.topic, indexedAccount],
        [RedeemedMasset.topic, indexedAccount],
        [Swapped.topic, indexedAccount],
      ];

      getHistoricTransactions(
        massetContract,
        account,
        massetTopics,
        filter.current,
      ).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, massetContract]);

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

      const savingsTopics: (string | null)[][] = [
        [SavingsDeposited.topic, indexedAccount],
        [CreditsRedeemed.topic, indexedAccount],
      ];

      getHistoricTransactions(
        savingsContract,
        account,
        savingsTopics,
        filter.current,
      ).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, savingsContract]);

  return null;
};
