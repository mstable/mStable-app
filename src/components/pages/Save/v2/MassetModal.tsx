import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import { SavingsContractFactory } from '../../../../typechain/SavingsContractFactory';
import { SaveWrapperFactory } from '../../../../typechain/SaveWrapperFactory';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { TransactionManifest } from '../../../../web3/TransactionManifest';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { ADDRESSES } from '../../../../constants';
import { Interfaces } from '../../../../types';
import { TabBtn, TabsContainer, Message } from '../../../core/Tabs';
import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { BigDecimal } from '../../../../web3/BigDecimal';
import {
  formatMassetName,
  useSelectedMassetName,
} from '../../../../context/SelectedMassetNameProvider';

const formId = 'MassetModal';

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

export const MassetModal: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();
  const massetAddress = massetState?.address;
  const massetSymbol = massetState?.token.symbol;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveAddress = savingsContract?.address;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    massetAddress,
  );

  const inputToken = useTokenSubscription(inputAddress);

  const formattedMassetName = formatMassetName(massetName);

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

  const exchangeRate = useMemo(
    () => ({
      value: savingsContract?.latestExchangeRate?.rate
        ? BigDecimal.ONE.divPrecisely(savingsContract.latestExchangeRate.rate)
        : undefined,
      fetching: !savingsContract,
    }),
    [savingsContract],
  );

  const inputAddressOptions = useMemo(() => {
    return [{ address: massetAddress as string }];
  }, [massetAddress]);

  const depositApprove = useMemo(
    () => ({
      spender: saveAddress as string,
      amount: inputAmount,
      address: massetAddress as string,
    }),
    [inputAmount, massetAddress, saveAddress],
  );

  const stakeApprove = useMemo(
    () => ({
      spender: ADDRESSES.mUSD.SaveWrapper as string,
      amount: inputAmount,
      address: massetAddress as string,
    }),
    [inputAmount, massetAddress],
  );

  const valid = !!(
    !error &&
    inputAddress &&
    inputAmount &&
    inputAmount.simple > 0
  );

  return (
    <Container>
      <TabsContainer>
        <TabBtn active>Deposit {formattedMassetName}</TabBtn>
      </TabsContainer>
      <Message>
        <span>
          {formattedMassetName} will be deposited and you will receive{' '}
          {`i${formattedMassetName}`} (interest-bearing
          {` ${formattedMassetName}`}).
          <br />
          Deposit to the Vault to earn bonus MTA rewards.
          <br />
          Your {`i${formattedMassetName}`} can be redeemed for{' '}
          {formattedMassetName} at any time.
        </span>
      </Message>
      <AssetExchange
        inputAddressOptions={inputAddressOptions}
        inputAddress={inputAddress}
        inputAddressDisabled
        inputAmount={inputAmount}
        inputFormValue={inputFormValue}
        outputAddress={saveAddress}
        exchangeRate={exchangeRate}
        handleSetAddress={setInputAddress}
        handleSetAmount={setInputFormValue}
        handleSetMax={() => {
          if (inputToken) {
            setInputFormValue(inputToken.balance.string);
          }
        }}
        error={error}
      >
        <SendButton
          valid={valid}
          title={`Mint i${formattedMassetName}`}
          handleSend={() => {
            if (saveAddress && signer && inputAmount && massetSymbol) {
              const body = `${inputAmount.format()} ${massetSymbol}`;
              propose<Interfaces.SavingsContract, 'depositSavings(uint256)'>(
                new TransactionManifest(
                  SavingsContractFactory.connect(saveAddress, signer),
                  'depositSavings(uint256)',
                  [inputAmount.exact],
                  {
                    present: `Depositing ${body}`,
                    past: `Deposited ${body}`,
                  },
                  formId,
                ),
              );
            }
          }}
          approve={depositApprove}
        />
        {ADDRESSES.mUSD.SaveWrapper && (
          <SendButton
            valid={valid}
            title="Mint & Deposit to Vault"
            handleSend={() => {
              if (signer && inputAmount && massetSymbol) {
                const body = `${inputAmount.format()} ${massetSymbol}`;
                propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                  new TransactionManifest(
                    SaveWrapperFactory.connect(
                      ADDRESSES.mUSD.SaveWrapper as string,
                      signer,
                    ),
                    'saveAndStake',
                    [inputAmount.exact],
                    {
                      present: `Depositing and staking ${body}`,
                      past: `Deposited and staking ${body}`,
                    },
                    formId,
                  ),
                );
              }
            }}
            approve={stakeApprove}
          />
        )}
      </AssetExchange>
    </Container>
  );
};
