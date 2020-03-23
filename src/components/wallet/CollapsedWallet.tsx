import React, { ComponentProps, FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { useExpandWallet } from '../../context/UIProvider';
import { useTruncatedAddress } from '../../web3/hooks';
import { Button } from '../core/Button';
import { Size } from '../../theme';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const Container = styled.div`
  height: 100%;
`;

const PendingTransactions = styled.div<{ connected: boolean }>`
  visibility: ${props => (props.connected ? 'visible' : 'hidden')};
  height: 25px;
  width: 100%;
  background: ${props => props.theme.color.blue};
  color: ${props => props.theme.color.background};
  padding: 0 ${props => props.theme.spacing.l};
  font-size: 13px;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  background: ${props => props.theme.color.foreground};
  display: flex;
  height: calc(100% - 25px);
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.s} ${props => props.theme.spacing.l};
  color: ${props => props.theme.color.background};
`;

const ConnectButton = styled(Button)<ComponentProps<typeof Button>>`
  width: 100%;
`;

const Address = styled.div``;

const Balance = styled.div``;

const Blockie = styled.i``;

const Account = styled.div``;
const BalanceLabel = styled.div`
  font-size: 13px;
`;

const BalanceValue = styled.div``;

export const CollapsedWallet: FC<{}> = () => {
  const { connected, account } = useWallet<InjectedEthereum>();
  const truncatedAddress = useTruncatedAddress(account);
  const expandWallet = useExpandWallet();

  return (
    <Container onClick={expandWallet}>
      <PendingTransactions connected={connected}>
        Pending transactions...
      </PendingTransactions>
      <Content>
        {connected ? (
          <>
            <Balance>
              <BalanceLabel>Your balance</BalanceLabel>
              <BalanceValue>10,000.00 mUSD</BalanceValue>
            </Balance>
            <Account>
              <Blockie />
              <Address>{truncatedAddress}</Address>
            </Account>
          </>
        ) : (
          <ConnectButton type="button" size={Size.l} inverted>
            Connect wallet
          </ConnectButton>
        )}
      </Content>
    </Container>
  );
};
