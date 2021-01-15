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

const formId = 'SaveRedeem';

export const SaveRedeem: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveExchangeRate = savingsContract?.latestExchangeRate?.rate;
  const saveAddress = savingsContract?.address;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const inputToken = useTokenSubscription(saveAddress);

  const error = useMemo<string | undefined>(() => {
    if (
      inputAmount &&
      inputToken &&
      inputToken.balance.exact.lt(inputAmount.exact)
    ) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [inputToken, inputAmount]);

  const inputAddressOptions = useMemo(() => {
    return [{ address: saveAddress as string }];
  }, [saveAddress]);

  const exchangeRate = useMemo(() => {
    const value = saveExchangeRate
      ? BigDecimal.parse('1').divPrecisely(saveExchangeRate)
      : undefined;
    return {
      value,
      fetching: !value,
    };
  }, [saveExchangeRate]);

  const valid = !!(!error && inputAmount && inputAmount.simple > 0);

  return (
    <AssetExchange
      inputAddressOptions={inputAddressOptions}
      inputAddress={saveAddress}
      inputAmount={inputAmount}
      inputFormValue={inputFormValue}
      outputAddress={massetAddress}
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
        title="Redeem credits"
        handleSend={() => {
          if (
            signer &&
            saveAddress &&
            massetAddress &&
            inputAmount &&
            saveAddress
          ) {
            // TODO: add detail to purpose
            return propose<
              Interfaces.SavingsContract,
              'redeemCredits(uint256)'
            >(
              new TransactionManifest(
                SavingsContractFactory.connect(saveAddress, signer),
                'redeemCredits(uint256)',
                [inputAmount.exact],
                {
                  present: 'Redeeming credits',
                  past: 'Redeemed credits',
                },
                formId,
              ),
            );
          }
        }}
      />
    </AssetExchange>
  );
};
