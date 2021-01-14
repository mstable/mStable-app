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
import { UniswapRouter02Factory } from '../../../../typechain/UniswapRouter02Factory';
import { Button } from '../../../core/Button';
import { BigDecimal } from '../../../../web3/BigDecimal';

const formId = 'MassetModal';
const UNISWAP_ROUTER02 = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

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
      <Button
        onClick={async () => {
          if (signer) {
            const path = [
              '0xc778417E063141139Fce010982780140Aa0cD5Ab', // weth
              '0xaD6D458402F60fD3Bd25163575031ACDce07538D', // dai
            ];
            const uniswap = UniswapRouter02Factory.connect(
              UNISWAP_ROUTER02,
              signer,
            );
            const input = BigDecimal.parse('0.01');
            const amountsOut = await uniswap.getAmountsOut(input.exact, path);

            const amountOut = new BigDecimal(amountsOut[1]);
            const curvePosition = 0;
            const minOutCurve = new BigDecimal(99e16 * input.simple);

            // console.log(
            //   'alert',
            //   input.simple.toFixed(18),
            //   amountOut.simple.toFixed(18),
            //   // curvePosition.toString(),
            //   minOutCurve.toString(),
            // );

            propose<
              Interfaces.SaveWrapper,
              'saveViaUniswapETH(uint256,address[],int128,uint256,bool)'
            >(
              new TransactionManifest(
                SaveWrapperFactory.connect(ADDRESSES.mUSD.SaveWrapper, signer),
                'saveViaUniswapETH(uint256,address[],int128,uint256,bool)',
                [
                  amountOut.exact,
                  path,
                  curvePosition,
                  minOutCurve.exact,
                  false,
                ],
                {
                  present: `Curving in`,
                  past: `Curve out, over.`,
                },
                formId,
              ),
            );
          }
        }}
      >{`Eth -> mUSD`}</Button>
      <AssetExchange
        inputAddressOptions={inputAddressOptions}
        inputAddress={inputAddress}
        inputAddressDisabled
        inputFormValue={inputFormValue}
        outputAddress={saveAddress}
        exchangeRate={savingsContract?.latestExchangeRate?.rate}
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
