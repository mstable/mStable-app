import { useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { hexZeroPad } from 'ethers/utils';
import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { getHistoricTransactions } from '../web3/getHistoricTransactions';
import {
  useMusdContract,
  useSavingsContract,
} from '../context/DataProvider/ContractsProvider';

// When mUSD was deployed
const fromBlock =
  process.env.REACT_APP_CHAIN_ID === '1'
    ? 10152900
    : process.env.REACT_APP_CHAIN_ID === '3'
    ? 7883370
    : 0;

export const ContractsUpdater = (): null => {
  const { account } = useWallet();
  const { addHistoric, reset } = useTransactionsDispatch();

  const mUsdContract = useMusdContract();
  const savingsContract = useSavingsContract();

  /**
   * When the account changes, reset the transactions state.
   */
  useEffect(reset, [account, reset]);

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

      getHistoricTransactions(mUsdContract, account, mUSDTopics, {
        fromBlock,
      }).then(logs => {
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

      getHistoricTransactions(savingsContract, account, mUSDSavingsTopics, {
        fromBlock,
      }).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, savingsContract]);

  return null;
};
