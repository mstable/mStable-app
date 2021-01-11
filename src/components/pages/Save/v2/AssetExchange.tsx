import React, { FC } from 'react';
import styled from 'styled-components';

import { SaveWrapperFactory } from '../../../../typechain/SaveWrapperFactory';
import { SavingsContractFactory } from '../../../../typechain/SavingsContractFactory';
import { BoostedSavingsVaultFactory } from '../../../../typechain/BoostedSavingsVaultFactory';
import { useSigner } from '../../../../context/OnboardProvider';
import { useTransactionsDispatch } from '../../../../context/TransactionsProvider';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { ADDRESSES } from '../../../../constants';
import { Fields, Interfaces } from '../../../../types';
import { ViewportWidth } from '../../../../theme';
import { SendButton } from '../../../forms/SendButton';

import { AssetInputBox } from './AssetInputBox';
import { useSaveState } from './SaveProvider';
import { SaveMode } from './types';

const { Input, Output } = Fields;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    justify-content: space-between;

    @media (min-width: ${ViewportWidth.l}) {
      flex-direction: row;
    }
  }
`;

const Exchange = styled.div`
  flex-direction: column;
`;

const Details = styled.div`
  flex-direction: column-reverse;

  > * {
    margin-top: 0.75rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      flex-basis: 47.5%;
    }
  }
`;

const InputBox = styled(AssetInputBox)`
  flex-basis: 47.5%;
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 0.5rem 0;

  @media (min-width: ${ViewportWidth.l}) {
    margin: 0;
  }
`;

const Arrow = styled.div`
  border-radius: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${ViewportWidth.l}) {
    span {
      visibility: hidden;
    }
    span:before {
      content: '→';
      font-size: 1.25rem;
      visibility: visible;
      left: 0;
      right: 0;
      text-align: center;
      position: absolute;
    }
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 0.75rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 2rem;
  margin-bottom: 0.75rem;
  background: ${({ theme }) => theme.color.redTransparenter};

  p {
    text-align: center;
    opacity: 0.75;
    font-size: 0.875rem;
    line-height: 1.75em;
  }
`;

const formId = 'assetExchange';

const DepositActions: FC = () => {
  const signer = useSigner();
  const { propose } = useTransactionsDispatch();

  const {
    exchange: { input },
    valid,
    massetState,
  } = useSaveState();

  const saveAddress = massetState?.savingsContracts.v2?.address;

  return input.tokenAddress === saveAddress ? (
    <SendButton
      title="Stake"
      valid={valid}
      approve={{
        amount: input.amount,
        address: input.tokenAddress as string,
        spender: ADDRESSES.mUSD.SaveWrapper,
      }}
      handleSend={() => {
        if (!signer || !input.amount || !input.token || !massetState || !valid)
          return;

        propose<Interfaces.BoostedSavingsVault, 'stake'>(
          new TransactionManifest(
            BoostedSavingsVaultFactory.connect(
              massetState.savingsContracts.v2?.boostedSavingsVault
                ?.address as string,
              signer,
            ),
            'stake',
            [input.amount.exact],
            {
              present: `Staking ${input.amount.simple} ${input.token.symbol} in vault`,
              past: `Staked ${input.amount.simple} ${input.token.symbol} in vault`,
            },
            formId,
          ),
        );
      }}
    />
  ) : (
    <>
      <SendButton
        title="Deposit & Stake"
        valid={valid}
        approve={{
          amount: input.amount,
          address: input.tokenAddress as string,
          spender: ADDRESSES.mUSD.SaveWrapper,
        }}
        handleSend={() => {
          if (!signer || !input.amount || !valid) return;

          propose<Interfaces.SaveWrapper, 'saveAndStake'>(
            new TransactionManifest(
              SaveWrapperFactory.connect(ADDRESSES.mUSD.SaveWrapper, signer),
              'saveAndStake',
              [input.amount.exact],
              {
                present: `Depositing and staking ${input.amount.simple} in vault`,
                past: `Deposited and staked ${input.amount.simple} in vault`,
              },
              formId,
            ),
          );
        }}
      />
      <SendButton
        title="Deposit"
        valid={valid}
        approve={{
          amount: input.amount,
          address: input.tokenAddress as string,
          spender: saveAddress as string,
        }}
        handleSend={(): void => {
          if (!signer || !input.amount || !input.token || !valid) {
            return;
          }

          const tx = new TransactionManifest<
            Interfaces.SavingsContract,
            'depositSavings(uint256)'
          >(
            SavingsContractFactory.connect(saveAddress as string, signer),
            'depositSavings(uint256)',
            [input.amount.exact],
            {
              present: `Depositing ${input.amount.simple} ${input.token.symbol}`,
              past: `Deposited ${input.amount.simple} ${input.token.symbol}`,
            },
            formId,
          );
          propose(tx);
        }}
      />
    </>
  );
};

const WithdrawActions: FC = () => {
  const signer = useSigner();
  const { propose } = useTransactionsDispatch();

  const {
    exchange: { input },
    valid,
    massetState,
  } = useSaveState();

  const saveAddress = massetState?.savingsContracts.v2?.address;
  const vaultAddress =
    massetState?.savingsContracts.v2?.boostedSavingsVault?.address;

  return (
    <>
      <SendButton
        title="Withdraw Savings"
        valid={valid}
        handleSend={(): void => {
          if (
            !valid ||
            !input.amount ||
            !input.token ||
            !signer ||
            !saveAddress
          ) {
            return;
          }

          const body = `${input.amount.simple} ${input.token.symbol}`;
          const tx = new TransactionManifest<
            Interfaces.SavingsContract,
            'redeemUnderlying(uint256)'
          >(
            SavingsContractFactory.connect(saveAddress, signer),
            'redeemUnderlying(uint256)',
            [input.amount.exact],
            {
              present: `Withdrawing ${body}`,
              past: `Withdrew ${body}`,
            },
            formId,
          );
          propose(tx);
        }}
      />
      <SendButton
        title="Withdraw Stake"
        valid={valid}
        handleSend={() => {
          if (
            !valid ||
            !input.amount ||
            !input.token ||
            !signer ||
            !vaultAddress
          ) {
            return;
          }

          const body = `stake of ${input.amount.simple} ${input.token.symbol} from vault and claiming rewards`;
          const tx = new TransactionManifest<
            Interfaces.BoostedSavingsVault,
            'withdraw'
          >(
            BoostedSavingsVaultFactory.connect(vaultAddress, signer),
            'withdraw',
            [input.amount.exact],
            {
              present: `Withdrawing ${body}`,
              past: `Withdrew ${body}`,
            },
            formId,
          );
          propose(tx);
        }}
      />
      <SendButton
        title="Exit"
        valid={valid}
        handleSend={() => {
          if (!valid || !input.token || !signer || !vaultAddress) {
            return;
          }

          const body = `vault and claiming rewards`;
          const tx = new TransactionManifest<
            Interfaces.BoostedSavingsVault,
            'exit()'
          >(
            BoostedSavingsVaultFactory.connect(vaultAddress, signer),
            'exit()',
            [], // TODO provide first/last args
            {
              present: `Exiting ${body}`,
              past: `Exited ${body}`,
            },
            formId,
          );
          propose(tx);
        }}
      />
    </>
  );
};

export const AssetExchange: FC = () => {
  const { error, exchange, mode } = useSaveState();

  const formattedSlippage = `${exchange.slippage?.format(2)}%`;

  return (
    <Container>
      <Exchange>
        <InputBox
          title={mode === 0 ? 'Deposit' : 'Withdraw'}
          fieldType={Input}
        />
        <ArrowContainer>
          <Arrow onClick={() => {}}>
            <span>↓</span>
          </Arrow>
        </ArrowContainer>
        <InputBox title="Receive" fieldType={Output} showExchangeRate />
      </Exchange>
      <Details>
        <Column>
          {error && (
            <Error>
              <p>{error}</p>
            </Error>
          )}
          {mode === SaveMode.Deposit ? <DepositActions /> : <WithdrawActions />}
        </Column>
        {exchange.slippage && (
          <Info>
            <p>Slippage Tolerance</p>
            <span>{formattedSlippage}</span>
          </Info>
        )}
      </Details>
    </Container>
  );
};
