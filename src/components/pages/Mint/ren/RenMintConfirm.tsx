import React, { FC } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import { Bitcoin, Ethereum } from '@renproject/chains';

import { useAccount } from '../../../../context/UserProvider';
import { Button } from '../../../core/Button';
import { useRenMintStep, useRenMintState } from './RenMintProvider';
import { useRenDispatch, useRenState } from '../../../../context/RenProvider';
import { ADDRESSES } from '../../../../constants';
import { useWeb3Provider } from '../../../../context/OnboardProvider';
import { Step } from './types';
import { useThemeMode } from '../../../../context/AppProvider';
import { getBlockchairLink, getEtherscanLink } from '../../../../utils/strings';
import { ExternalLink } from '../../../core/ExternalLink';

const Address = styled.div`
  padding: 0 1.75rem;
  word-break: break-all;
  border: 1px solid ${({ theme }) => theme.color.accent};
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  text-align: center;
  justify-content: center;
  ${({ theme }) => theme.mixins.numeric};

  a {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

const Confirmation = styled.div`
  display: flex;
  flex-direction: column;

  > *:not(:first-child) {
    line-height: 1rem;
    align-items: center;
    display: flex;
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }
`;

export const RenMintConfirm: FC = () => {
  const address = useAccount();
  const provider = useWeb3Provider();
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
        sendTo: ADDRESSES.mBTC?.SaveWrapper as string,
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
  const ethAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';

  return (
    <>
      <Confirmation>
        <p>Sucessfully deposited 1.0231 BTC to:</p>
        <Address>
          <ExternalLink href={getBlockchairLink(btcAddress, 'address')}>
            {btcAddress}
          </ExternalLink>
        </Address>
      </Confirmation>
      <Confirmation>
        <p>
          To finalize, you will need to send a transaction from the following
          Ethereum address:
        </p>
        <Address>
          <ExternalLink href={getEtherscanLink(ethAddress, 'address')}>
            {ethAddress}
          </ExternalLink>
        </Address>
      </Confirmation>
      <Button highlighted onClick={handleConfirmClick}>
        Finalize
      </Button>
    </>
  );
};
