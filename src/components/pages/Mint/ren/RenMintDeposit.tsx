import React, { FC, useEffect } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import { Bitcoin, Ethereum } from '@renproject/chains';
import QRCode from 'react-qr-code';
import { useAccount } from '../../../../context/UserProvider';
import { useRenMintStep, useRenMintState } from './RenMintProvider';
import { useRenDispatch, useRenState } from '../../../../context/RenProvider';
import { ADDRESSES } from '../../../../constants';
import { useWeb3Provider } from '../../../../context/OnboardProvider';
import { Step } from './types';
import { useThemeMode } from '../../../../context/AppProvider';
import { getColorTheme } from '../../../../theme';
import { Tooltip } from '../../../core/ReactTooltip';

const Address = styled.span`
  font-size: 0.875rem;
  padding: 0 1.75rem;
  word-break: break-all;
  text-align: center;
`;

const TransactionBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;
  width: 18rem;
  align-self: center;
  align-items: center;

  p {
    line-height: 1.5rem;
    text-align: center;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
  }

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const TransactionStatus = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.color.bodyAccent};
`;

export const RenMintDeposit: FC = () => {
  const address = useAccount();
  const provider = useWeb3Provider();
  const themeMode = useThemeMode();
  const [toggleEnabled, setToggle] = useToggle(false);
  const state = useRenMintState();
  const [_, setStep] = useRenMintStep();

  const { start, remove, restore } = useRenDispatch();
  const { current, lockAndMint, storage, fees } = useRenState();

  const {
    inputFormValue,
    inputAddressOptions,
    inputAddress,
    outputAddress,
    outputAddressOptions,
  } = state?.onboardData ?? {};

  const handleConfirmClick = (): void => {
    if (!toggleEnabled || !provider || !address) return;

    const id = Math.random().toString();

    const params = {
      asset: 'BTC',
      from: Bitcoin(),
      to: Ethereum(provider).Contract({
        sendTo: ADDRESSES.mbtc?.SaveWrapper as string,
        contractFn: 'mintAndSaveViaRen',
        contractParams: [
          {
            type: 'address',
            name: 'recipient',
            value: address,
          },
          // TODO
        ],
      }),
    };

    start(id, params);
    setStep(Step.Deposit);
  };

  const onCancelClick = (): void => {};

  const btcAddress = '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX';

  return (
    <>
      <TransactionStatus>
        Deposit not yet received
        <Tooltip tip="Your transaction will show after 1 confirmation" />
      </TransactionStatus>
      <TransactionBox>
        <p>
          Deposit exactly <span>1.0231</span> BTC to the following BTC address:{' '}
        </p>
        <QRCode
          value={btcAddress}
          size={128}
          bgColor={getColorTheme(themeMode).background}
          fgColor={getColorTheme(themeMode).body}
        />
        <Address>{btcAddress}</Address>
      </TransactionBox>
    </>
  );
};
