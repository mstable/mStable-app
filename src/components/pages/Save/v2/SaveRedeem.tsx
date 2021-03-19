import React, { FC, useMemo } from 'react';
import { ISavingsContractV2__factory } from '@mstable/protocol/types/generated';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { BigDecimal } from '../../../../web3/BigDecimal';

const formId = 'SaveRedeem';

export const SaveRedeem: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const massetSymbol = massetState?.token.symbol;
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
      ? saveExchangeRate.divPrecisely(BigDecimal.ONE)
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
      outputAddressOptions={[{ address: massetAddress as string }]}
      inputAddress={saveAddress}
      inputAddressDisabled
      inputFormValue={inputFormValue}
      outputAddress={massetAddress}
      error={error}
      exchangeRate={exchangeRate}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string);
        }
      }}
    >
      <SendButton
        valid={valid}
        title={`Redeem ${massetSymbol}`}
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
                ISavingsContractV2__factory.connect(saveAddress, signer),
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
