import React, { FC, useState } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import { useAccount } from '../../../../context/UserProvider';

import { TransactionOption } from '../../../../types';
import { Arrow } from '../../../core/Arrow';
import { Button } from '../../../core/Button';
import { Dropdown } from '../../../core/Dropdown';
import { ToggleInput } from '../../../forms/ToggleInput';

enum Step {
  Initiate,
  Deposit,
  Pending,
  Confirm,
  Complete,
}

export interface Props {
  inputAddress?: string;
  inputFormValue?: string;
  inputAddressOptions: TransactionOption[];
  outputAddress?: string;
  outputAddressOptions: TransactionOption[];
  onCancelClick?: () => void;
}

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

const Header = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.color.accent};
  width: 100%;
  margin-bottom: 1.5rem;
`;

const Container = styled.div`
  border: ${({ theme }) => `1px solid ${theme.color.accent}`};
  border-radius: 1rem;
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;

  > *:not(:last-child):not(:first-child) {
    margin-bottom: 2rem;
  }
`;

export const RenMintOnboard: FC<Props> = ({
  inputFormValue,
  inputAddressOptions,
  inputAddress,
  outputAddress,
  outputAddressOptions,
  onCancelClick,
}) => {
  const [step, setStep] = useState(Step.Initiate);

  const address = useAccount();
  const [toggleEnabled, setToggle] = useToggle(false);

  const handleConfirmClick = (): void => {
    switch (step) {
      case Step.Initiate: {
        if (!toggleEnabled) return;
        setStep(Step.Deposit);
        break;
      }
      case Step.Deposit:
        setStep(step + 1);
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <Header>
        <h2>Initiate Transaction</h2>
      </Header>
      {
        ({
          [Step.Initiate]: (
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
                You must have access to the above Ethereum address, else you
                will not be able to complete the transaction
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
          ),
          [Step.Deposit]: <p>Hello1</p>,
          [Step.Pending]: <p>Hello2</p>,
          [Step.Confirm]: <p>Hello3</p>,
          [Step.Complete]: <p>Hello4</p>,
        } as Record<Step, JSX.Element>)[step]
      }
    </Container>
  );
};
