import React, { FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { useExpandWallet } from '../../context/UIProvider';
import { useTruncatedAddress } from '../../web3/hooks';
import { Button } from '../core/Button';
import { FontSize, Size } from '../../theme';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const Container = styled.div`
  cursor: pointer;
`;

const Address = styled.div`
  font-size: ${FontSize.s};
`;

const Blockie = styled.div`
  // TODO replace with actual blockie
  width: 16px;
  height: 16px;
  background: green;
  margin-right: ${props => props.theme.spacing.xs};
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WalletButton: FC<{}> = () => {
  const { connected, account } = useWallet<InjectedEthereum>();
  const truncatedAddress = useTruncatedAddress(account);
  const expandWallet = useExpandWallet();

  return (
    <Container onClick={expandWallet}>
      {connected ? (
        <Account>
          <Blockie />
          <Address>{truncatedAddress}</Address>
        </Account>
      ) : (
        <Button type="button" size={Size.s}>
          Connect
        </Button>
      )}
    </Container>
  );
};
