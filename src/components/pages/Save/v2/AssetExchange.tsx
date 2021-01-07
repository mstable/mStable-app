import { MaxUint256 } from 'ethers/constants';
import React, { FC } from 'react';
import styled from 'styled-components';
import { ADDRESSES } from '../../../../constants';
import { useWalletAddress } from '../../../../context/OnboardProvider';
import { useTokenAllowance } from '../../../../context/TokensProvider';
import { useTransactionsDispatch } from '../../../../context/TransactionsProvider';

import { ViewportWidth } from '../../../../theme';
import { Fields, Interfaces } from '../../../../types';
import {
  useSaveWrapperContract,
  useSelectedMassetContract,
  useSelectedSaveV2Contract,
} from '../../../../web3/hooks';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { ApproveType, MultiStepButton } from '../../../core/MultiStepButton';
import { AssetInputBox } from './AssetInputBox';
import { useSaveState } from './SaveProvider';
import { SaveMode } from './types';

const { Input, Output } = Fields;
const { Deposit } = SaveMode;

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

  > div:last-child {
    margin-top: 0.75rem;
  }
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

export const AssetExchange: FC = () => {
  const {
    error,
    exchange,
    exchange: { input },
    valid,
    mode,
    massetState,
  } = useSaveState();

  const massetContract = useSelectedMassetContract();
  const v2Address = massetContract?.address;
  const depositAllowance = useTokenAllowance(input.token?.address, v2Address);
  const wrapperAddress = ADDRESSES.mUSD.SaveWrapper;
  const depositAndStakeAllowance = useTokenAllowance(
    input.token?.address,
    wrapperAddress,
  );
  const savingsContractV2 = useSelectedSaveV2Contract();
  const walletAddress = useWalletAddress();
  const wrapperContract = useSaveWrapperContract();
  const { propose } = useTransactionsDispatch();

  const massetSymbol = massetState?.token.symbol;
  const formattedSlippage = `${exchange.slippage?.format(2)}%`;
  const depositNeedsUnlock =
    depositAllowance && input.amount?.exact.gt(depositAllowance.exact);
  const depositAndStakeNeedsUnlock =
    depositAndStakeAllowance &&
    input.amount?.exact.gt(depositAndStakeAllowance.exact);

  const handleActionClick = (): void => {
    if (!savingsContractV2) return;

    const amount = input.amount?.exact;
    if (!amount) return;

    if (mode === Deposit) {
      const tx = new TransactionManifest<
        Interfaces.SavingsContract,
        'depositSavings(uint256,address)'
      >(
        savingsContractV2,
        'depositSavings(uint256,address)',
        [amount, walletAddress as string],
        {
          present: `Depositing ${amount.toString()}`,
          past: `Deposited ${amount.toString()}`,
        },
        formId,
      );
      propose(tx);
    } else {
      const tx = new TransactionManifest<
        Interfaces.SavingsContract,
        'redeemUnderlying(uint256)'
      >(
        savingsContractV2,
        'redeemUnderlying(uint256)',
        [amount],
        {
          present: `Withdrawing ${amount.toString()}`,
          past: `Withdrew ${amount.toString()}`,
        },
        formId,
      );
      propose(tx);
    }
  };

  const handleDepositAndStakeClick = (): void => {
    if (!wrapperContract) return;

    const amount = input.amount?.exact;
    if (!amount) return;

    const tx = new TransactionManifest<
      Interfaces.SaveWrapper,
      'saveAndStake(uint256)'
    >(
      wrapperContract,
      'saveAndStake(uint256)',
      [amount],
      {
        present: `Saving and staking ${input.amount?.simple.toString()}`,
        past: `Saved and staked ${input.amount?.simple.toString()}`,
      },
      formId,
    );
    propose(tx);
  };

  const sendApproveSpenderTx = (type: ApproveType, spender?: string): void => {
    const amount = type === 'exact' ? input.amount?.exact : MaxUint256;

    if (!amount) return;
    if (!(spender && massetSymbol && massetContract)) return;

    const body = `transfer of ${massetSymbol}`;
    const tx = new TransactionManifest<Interfaces.ERC20, 'approve'>(
      massetContract,
      'approve',
      [spender, amount],
      {
        present: `Approving ${body}`,
        past: `Approved ${body}`,
      },
      formId,
    );
    propose(tx);
  };

  const handleApproveClick = (type: ApproveType): void =>
    sendApproveSpenderTx(type, v2Address);

  const handleDepositAndStakeApproveClick = (type: ApproveType): void =>
    sendApproveSpenderTx(type, wrapperAddress);

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
          <MultiStepButton
            title={mode === 0 ? 'Deposit' : 'Withdraw'}
            needsUnlock={depositNeedsUnlock}
            valid={valid}
            onActionClick={handleActionClick}
            onApproveClick={handleApproveClick}
          />
          {mode === 0 && (
            <MultiStepButton
              title="Deposit & Stake"
              needsUnlock={depositAndStakeNeedsUnlock}
              valid={valid}
              onActionClick={handleDepositAndStakeClick}
              onApproveClick={handleDepositAndStakeApproveClick}
            />
          )}
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
