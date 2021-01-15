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
import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { AssetExchange } from '../../../forms/AssetExchange';
import { SendButton } from '../../../forms/SendButton';

const formId = 'MassetModal';

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

// TODO ropsten: use DAI 0xb5e5d0f8c0cba267cd3d7035d6adc8eba7df7cdd

export const MassetModal: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address;
  const massetSymbol = massetState?.token.symbol;
  const savingsContract = massetState?.savingsContracts.v2;
  const saveAddress = savingsContract?.address;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();
  const [inputAddress, setInputAddress] = useState<string | undefined>(
    massetAddress,
  );

  const inputToken = useTokenSubscription(inputAddress);

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
      value: savingsContract?.latestExchangeRate?.rate,
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
      spender: ADDRESSES.mUSD.SaveWrapper,
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
        <TabBtn active>Deposit mUSD & receive imUSD</TabBtn>
      </TabsContainer>
      <AssetExchange
        inputAddressOptions={inputAddressOptions}
        inputAddress={inputAddress}
        inputAddressDisabled
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
          title="Deposit"
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
        <SendButton
          valid={valid}
          title="Deposit & Stake"
          handleSend={() => {
            if (signer && inputAmount && massetSymbol) {
              const body = `${inputAmount.format()} ${massetSymbol}`;
              propose<Interfaces.SaveWrapper, 'saveAndStake'>(
                new TransactionManifest(
                  SaveWrapperFactory.connect(
                    ADDRESSES.mUSD.SaveWrapper,
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
      </AssetExchange>
    </Container>
  );
};
