import React, { FC, useMemo } from 'react';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { SavingsContractFactory } from '../../../../typechain/SavingsContractFactory';

import { Interfaces } from '../../../../types';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { useAccount } from '../../../../context/UserProvider';

const formId = 'PreDeposit';

const depositPurpose = {
  present: 'Pre-depositing savings',
  past: 'Pre-deposited savings',
};

export const PreDeposit: FC = () => {
  const signer = useSigner();
  const propose = usePropose();
  const walletAddress = useAccount();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const inputToken = useTokenSubscription(massetAddress);

  const error = useMemo<string | undefined>(() => {
    if (
      inputAmount &&
      inputToken?.balance &&
      inputToken.balance.simple < inputAmount.simple
    ) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [inputAmount, inputToken]);

  const inputAddressOptions = useMemo(() => {
    return [{ address: massetAddress as string }];
  }, [massetAddress]);

  const exchangeRate = useMemo<{
    fetching?: boolean;
    value?: BigDecimal;
  }>(() => {
    if (!inputAmount || !saveExchangeRate) return {};

    return { value: saveExchangeRate };
  }, [inputAmount, saveExchangeRate]);

  const approve = useMemo(
    () => ({
      spender: saveAddress as string,
      amount: inputAmount,
      address: massetAddress as string,
    }),
    [massetAddress, inputAmount, saveAddress],
  );

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      inputAddress={massetAddress}
      inputAddressDisabled
      inputAmount={inputAmount}
      inputFormValue={inputFormValue}
      outputAddress={saveAddress}
      error={error}
      exchangeRate={exchangeRate}
      handleSetAmount={setInputFormValue}
      handleSetMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string);
        }
      }}
    >
      <SendButton
        valid={valid}
        approve={approve}
        title="Pre-deposit"
        handleSend={() => {
          if (signer && saveAddress && walletAddress && inputAmount) {
            return propose<Interfaces.SavingsContract, 'preDeposit'>(
              new TransactionManifest(
                SavingsContractFactory.connect(saveAddress, signer),
                'preDeposit',
                [inputAmount.exact, walletAddress],
                depositPurpose,
                formId,
              ),
            );
          }
        }}
      />
    </AssetExchange>
  );
};
