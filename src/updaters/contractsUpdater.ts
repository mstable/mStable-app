import { useEffect, useMemo } from 'react';
import { useWallet } from 'use-wallet';
import { hexZeroPad } from 'ethers/utils';
import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { useKnownAddress } from '../context/KnownAddressProvider';
import { useSignerContext } from '../context/SignerProvider';
import { getHistoricTransactions } from '../web3/getHistoricTransactions';
import { MassetFactory } from '../typechain/MassetFactory';
import { ContractNames } from '../types';
import { SavingsContractFactory } from '../typechain/SavingsContractFactory';

// TODO replace: when mUSD was deployed on Ropsten
const fromBlock = process.env.REACT_APP_CHAIN_ID === '3' ? 7883370 : 0;

export const ContractsUpdater = (): null => {
  const { account } = useWallet();
  const { addHistoric, reset } = useTransactionsDispatch();
  const signer = useSignerContext();

  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const mUSD = useMemo(
    () =>
      mUSDAddress && signer ? MassetFactory.connect(mUSDAddress, signer) : null,
    [mUSDAddress, signer],
  );

  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);
  const mUSDSavings = useMemo(
    () =>
      mUSDSavingsAddress && signer
        ? SavingsContractFactory.connect(mUSDSavingsAddress, signer)
        : null,
    [mUSDSavingsAddress, signer],
  );

  /**
   * When the account changes, reset the transactions state.
   */
  useEffect(reset, [account, reset]);

  /**
   * When the account changes (and mUSD exists), get historic transactions.
   */
  useEffect(() => {
    if (mUSD && account && addHistoric) {
      const indexedAccount = hexZeroPad(account.toLowerCase(), 32);

      const {
        Minted,
        Swapped,
        Redeemed,
        PaidFee,
        MintedMulti,
      } = mUSD.interface.events;

      const mUSDTopics: (string | null)[][] = [
        [Minted.topic, indexedAccount],
        [MintedMulti.topic, indexedAccount],
        [PaidFee.topic],
        [Redeemed.topic, indexedAccount],
        [Swapped.topic, indexedAccount],
      ];

      getHistoricTransactions(mUSD, account, mUSDTopics, { fromBlock }).then(
        logs => {
          addHistoric(logs);
        },
      );
    }
  }, [addHistoric, account, mUSD]);

  /**
   * When the account changes (and mUSDSavings exists), get historic transactions.
   */
  useEffect(() => {
    if (mUSDSavings && account && addHistoric) {
      const indexedAccount = hexZeroPad(account.toLowerCase(), 32);

      const {
        SavingsDeposited,
        CreditsRedeemed,
      } = mUSDSavings.interface.events;

      const mUSDSavingsTopics: (string | null)[][] = [
        [SavingsDeposited.topic, indexedAccount],
        [CreditsRedeemed.topic, indexedAccount],
      ];

      getHistoricTransactions(mUSDSavings, account, mUSDSavingsTopics, {
        fromBlock,
      }).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, mUSDSavings]);

  return null;
};
