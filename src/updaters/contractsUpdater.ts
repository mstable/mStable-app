import { useEffect, useMemo } from 'react';
import { useWallet } from 'use-wallet';
import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { useKnownAddress } from '../context/KnownAddressProvider';
import { useSignerContext } from '../context/SignerProvider';
import { getHistoricTransactions } from '../web3/getHistoricTransactions';
import { MUSDFactory } from '../typechain/MUSDFactory';
import { ContractNames } from '../types';

// TODO replace: when mUSD was deployed on Ropsten
const fromBlock = 7669838;

export const ContractsUpdater = (): null => {
  const { account } = useWallet();
  const { addHistoric, reset } = useTransactionsDispatch();
  const signer = useSignerContext();

  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const mUSD = useMemo(
    () =>
      mUSDAddress && signer ? MUSDFactory.connect(mUSDAddress, signer) : null,
    [mUSDAddress, signer],
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
      getHistoricTransactions(mUSD, account, { fromBlock }).then(logs => {
        addHistoric(logs);
      });
    }
  }, [addHistoric, account, mUSD]);

  return null;
};
