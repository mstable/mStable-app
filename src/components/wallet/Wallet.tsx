/* eslint-disable no-console */
import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../core/Button';
import { H3 } from '../core/Typography';
import { Address } from '../core/Address';
import { FlexRow } from '../core/Containers';
import { PageHeader } from '../pages/PageHeader';
import { ReactComponent as AccountIcon } from '../icons/circle/account.svg';
import { Balances } from './Balances';
import { HistoricTransactions } from './HistoricTransactions';
import { Transactions } from './Transactions';
import { useCloseAccount } from '../../context/AppProvider';
import {
  useWalletAddress,
  useConnected,
  useWallet,
  useReset,
} from '../../context/OnboardProvider';

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  color: white;

  a {
    color: white;
  }
`;

const Rows = styled.div`
  width: 100%;
`;

const Row = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-top: 1px ${({ theme }) => theme.color.whiteTransparent} solid;
`;

const StyledAccountIcon = styled(AccountIcon)`
  > g:first-child > circle:first-child {
    fill: white;
  }
`;

const DisconnectButton = styled(Button)`
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.red};
`;

const AddressGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Connected: FC<{ walletLabel: string; account: string }> = ({
  walletLabel,
  account,
}) => {
  const reset = useReset();
  const closeWallet = useCloseAccount();
  const onReset = (): void => {
    if (reset) {
      reset();
      closeWallet();
    }
  };
  return (
    <Rows>
      <Row>
        <H3>Connected with {walletLabel}</H3>
        <AddressGroup>
          <Address address={account} type="account" copyable />
          <DisconnectButton type="button" onClick={onReset}>
            Disconnect
          </DisconnectButton>
        </AddressGroup>
      </Row>
      <Row>
        <H3>Balances</H3>
        <Balances />
      </Row>
      <Row>
        <H3>Transactions</H3>
        <Transactions />
      </Row>
      <Row>
        <H3>Historic transactions</H3>
        <HistoricTransactions account={account} />
      </Row>
    </Rows>
  );
};

export const Wallet: FC<{}> = () => {
  const address = useWalletAddress();
  const connected = useConnected();
  const wallet = useWallet();

  return (
    <Container>
      <div>
        <PageHeader
          icon={<StyledAccountIcon />}
          title="Account"
          subtitle={
            connected && address
              ? `Connected`
              : !connected && wallet && address !== undefined
              ? `Connecting to ${wallet.name as string} wallet`
              : 'Connect wallet'
          }
        />
        <FlexRow>
          {/* FIXME problem when first connecting; updates on unmounted components */}
          {connected && address && wallet && (
            <Connected walletLabel={wallet.name as string} account={address} />
          )}
        </FlexRow>
      </div>
    </Container>
  );
};
