import React, { FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { useExpandWallet } from '../../context/UIProvider';
import { useTruncatedAddress } from '../../web3/hooks';
import { Button } from '../core/Button';
import { FontSize, Size, ViewportWidth } from '../../theme';
import { Activity } from '../activity/Activity';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const Container = styled.div`
  cursor: pointer;
  order: 2;

  @media (min-width: ${ViewportWidth.m}) {
    order: 3;
  }
`;

const Address = styled.div`
  font-size: ${FontSize.s};
`;

const Blockie = styled.div`
  // TODO replace with actual blockie
  width: 16px;
  height: 16px;
  background: green;
  margin: 0 ${props => props.theme.spacing.xs};
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

  // TODO remove this; just for quick testing
  // useEffect(() => {
  //   activate('injected');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Container onClick={expandWallet}>
      {connected ? (
        <Account>
          <Activity />
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
