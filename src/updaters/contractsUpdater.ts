import { useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { getHistoricTransactions } from '../web3/getHistoricTransactions';
import {
  useMusdContract,
  useSavingsContract,
} from '../context/DataProvider/ContractsProvider';
import { useProviderContext } from '../context/EthereumProvider';

type Topics = (string | string[])[];

// When mUSD was deployed
const fromBlock =
  process.env.REACT_APP_CHAIN_ID === '1'
    ? 10152900
    : process.env.REACT_APP_CHAIN_ID === '3'
    ? 7883370
    : 0;

export const ContractsUpdater = (): null => {
  const { account, activated, connected } = useWallet();
  const { addHistoric, reset } = useTransactionsDispatch();
  const provider = useProviderContext();

  const mUsdContract = useMusdContract();
  const savingsContract = useSavingsContract();

  /**
   * When the account changes, reset the transactions state.
   */
  useEffect(reset, [account, activated, connected, reset]);

  /**
   * When the account changes (and mUSD exists), get historic transactions.
   */
  useEffect(() => {
    if (mUsdContract && account && addHistoric) {
      const indexedAccount = account.toLowerCase();

      const mUSDTopics: Topics[] = [
        mUsdContract.filters.Minted(indexedAccount, null, null, null, null)
          .topics as Topics,
        mUsdContract.filters.Swapped(indexedAccount, null, null, null, null)
          .topics as Topics,
        mUsdContract.filters.Redeemed(indexedAccount, null, null, null, null)
          .topics as Topics,
        mUsdContract.filters.RedeemedMasset(indexedAccount, null, null)
          .topics as Topics,
        mUsdContract.filters.MintedMulti(indexedAccount, null, null, null, null)
          .topics as Topics,
      ];

      getHistoricTransactions(provider, mUsdContract, account, mUSDTopics, {
        fromBlock,
      }).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, mUsdContract, provider]);

  /**
   * When the account changes (and mUSDSavings exists), get historic transactions.
   */
  useEffect(() => {
    if (savingsContract && account && addHistoric) {
      const indexedAccount = account.toLowerCase();

      const mUSDSavingsTopics: Topics[] = [
        savingsContract.filters.CreditsRedeemed(indexedAccount, null, null)
          .topics as Topics,
        savingsContract.filters.SavingsDeposited(indexedAccount, null, null)
          .topics as Topics,
      ];

      getHistoricTransactions(
        provider,
        savingsContract,
        account,
        mUSDSavingsTopics,
        {
          fromBlock,
        },
      ).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, savingsContract, provider]);

  return null;
};
