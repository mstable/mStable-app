import React, { FC } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import { Bitcoin, Ethereum } from '@renproject/chains';
import { useAccount } from '../../../../context/UserProvider';

import { Step } from './types';
import { useWeb3Provider } from '../../../../context/OnboardProvider';
import { useRenDispatch, useRenState } from '../../../../context/RenProvider';
import { useRenMintStep, useRenMintState } from './RenMintProvider';
import { Arrow } from '../../../core/Arrow';
import { Button } from '../../../core/Button';
import { Dropdown } from '../../../core/Dropdown';
import { ToggleInput } from '../../../forms/ToggleInput';
import { ADDRESSES } from '../../../../constants';

const AssetBox = styled(Dropdown)`
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
`;

const Amount = styled.h3`
  ${({ theme }) => theme.mixins.numeric};
  font-size: 1.25rem;
  line-height: 1.75rem;
`;

const Address = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: 600;

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-weight: normal;
    font-size: 0.875rem;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;

  > * {
    flex-basis: calc(50% - 0.5rem);
  }
`;

const ConfirmTransaction = styled.div`
  display: flex;

  > *:first-child {
    margin-right: 1rem;
  }
`;

const Dialog = styled.p`
  background: ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  line-height: 1.5rem;
`;

const Input = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  > div {
    display: flex;
    align-items: center;
  }
  > div > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const RenMintInitiate: FC = () => {
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

  return (
    <>
      <Input>
        <div>
          <Amount>{inputFormValue}</Amount>
          <AssetBox
            options={inputAddressOptions}
            defaultAddress={inputAddress}
            disabled
          />
        </div>
        <Arrow direction="right" />
        <div>
          <Amount>{inputFormValue}</Amount>
          <AssetBox
            options={outputAddressOptions}
            defaultAddress={outputAddress}
            disabled
          />
        </div>
      </Input>
      <Address>
        ETH Address:
        <span>{address}</span>
      </Address>
      <Dialog>
        You must have access to the above Ethereum address, else you will not be
        able to complete the transaction
      </Dialog>
      <ConfirmTransaction>
        <ToggleInput checked={toggleEnabled} onClick={setToggle} />
        <p>I confirm I have access to the above ETH address</p>
      </ConfirmTransaction>
      <Buttons>
        <Button
          disabled={!toggleEnabled}
          highlighted
          onClick={handleConfirmClick}
        >
          Confirm
        </Button>
        <Button onClick={onCancelClick}>Cancel</Button>
      </Buttons>
    </>
  );
};
