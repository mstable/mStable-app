import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ISavingsContractV2__factory } from '@mstable/protocol/types/generated';

import { SaveWrapper__factory } from '../../../../typechain';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { TransactionManifest } from '../../../../web3/TransactionManifest';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';

import { ADDRESSES } from '../../../../constants';
import { Interfaces } from '../../../../types';
import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { InfoMessage } from '../../../core/InfoMessage';

const formId = 'MassetModal';

const Container = styled.div`
  padding: 1rem;

  > *:first-child {
    margin-bottom: 1rem;
  }
`;

export const MassetModal: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetName = useSelectedMassetName();
  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const massetSymbol = massetState?.token.symbol;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveAddress = savingsContract?.address;
  const boostedSavingsVault = savingsContract?.boostedSavingsVault;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    massetAddress,
  );

  const inputToken = useTokenSubscription(inputAddress);

  const saveWrapperAddress = ADDRESSES[massetName]?.SaveWrapper;

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

  const outputAddressOptions = useMemo(() => {
    return [{ address: saveAddress as string }];
  }, [saveAddress]);

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
      spender: saveWrapperAddress as string,
      amount: inputAmount,
      address: massetAddress as string,
    }),
    [inputAmount, massetAddress, saveWrapperAddress],
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
        <TabBtn active>Deposit {massetSymbol}</TabBtn>
      </TabsContainer>
      <InfoMessage>
        <span>
          {massetSymbol} will be deposited and you will receive{' '}
          {`i${massetSymbol}`} (interest-bearing
          {` ${massetSymbol}`}).
          <br />
          {!!boostedSavingsVault && (
            <>
              Deposit to the Vault to earn bonus MTA rewards.
              <br />
            </>
          )}
          Your {`i${massetSymbol}`} can be redeemed for {massetSymbol} at any
          time.
        </span>
      </InfoMessage>
      <AssetExchange
        inputAddressOptions={inputAddressOptions}
        outputAddressOptions={outputAddressOptions}
        inputAddress={inputAddress}
        inputFormValue={inputFormValue}
        exchangeRate={exchangeRate}
        handleSetInputAddress={setInputAddress}
        handleSetInputAmount={setInputFormValue}
        handleSetInputMax={(): void => {
          if (inputToken) {
            setInputFormValue(inputToken.balance.string);
          }
        }}
        outputAddress={saveAddress}
        error={error}
      >
        <SendButton
          valid={valid}
          title={`Mint i${massetSymbol}`}
          handleSend={() => {
            if (saveAddress && signer && inputAmount && massetSymbol) {
              const body = `${inputAmount.format()} ${massetSymbol}`;
              propose<Interfaces.SavingsContract, 'depositSavings(uint256)'>(
                new TransactionManifest(
                  ISavingsContractV2__factory.connect(saveAddress, signer),
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
        {!!boostedSavingsVault && (
          <SendButton
            valid={valid}
            title="Mint & Deposit to Vault"
            handleSend={() => {
              if (signer && inputAmount && massetSymbol) {
                const body = `${inputAmount.format()} ${massetSymbol}`;
                propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                  new TransactionManifest(
                    SaveWrapper__factory.connect(
                      saveWrapperAddress as string,
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
