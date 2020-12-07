import React, { FC } from 'react';
import styled from 'styled-components';

import {
  useConnect,
  useConnected,
  useWallet,
  useWalletAddress,
} from '../../../context/OnboardProvider';
import { usePendingTxState } from '../../../context/TransactionsProvider';
import {
  AccountItems,
  useAccountItem,
  useToggleWallet,
} from '../../../context/AppProvider';

import { ReactComponent as CoinbaseIcon } from '../../icons/wallets/coinbase.svg';
import { ReactComponent as MetaMaskIcon } from '../../icons/wallets/metamask.svg';
import { ReactComponent as FortmaticIcon } from '../../icons/wallets/fortmatic.svg';
import { ReactComponent as PortisIcon } from '../../icons/wallets/portis.svg';
import { ReactComponent as SquarelinkIcon } from '../../icons/wallets/squarelink.svg';
import { ReactComponent as WalletConnectIcon } from '../../icons/wallets/walletconnect.svg';
import { ReactComponent as BraveIcon } from '../../icons/wallets/brave.svg';
import { ReactComponent as MeetOneIcon } from '../../icons/wallets/meetone.svg';
import { useTruncatedAddress } from '../../../web3/hooks';
import { TransactionStatus } from '../../../types';
import { Idle } from '../../icons/Idle';
import { ActivitySpinner } from '../../core/ActivitySpinner';
import { ViewportWidth } from '../../../theme';
import { AccountButton } from './AccountButton';

const WalletIcon: FC = () => {
  const wallet = useWallet();
  switch (wallet?.name) {
    case 'Coinbase':
      return <CoinbaseIcon />;
    case 'MetaMask':
      return <MetaMaskIcon />;
    case 'Fortmatic':
      return <FortmaticIcon />;
    case 'Portis':
      return <PortisIcon />;
    case 'SquareLink':
      return <SquarelinkIcon />;
    case 'WalletConnect':
      return <WalletConnectIcon />;
    case 'Brave':
      return <BraveIcon />;
    case 'Meetone':
      return <MeetOneIcon />;
    default:
      return <div />;
  }
};

const PendingTxContainer = styled.div<{
  pending: boolean;
  error: boolean;
  success: boolean;
}>`
  width: 17px;
  height: 17px;
  position: relative;
  margin-top: -1px;
  transition: color 0.5s ease;
  color: ${({ error, pending, success, theme }) =>
    error
      ? theme.color.red
      : success
      ? theme.color.green
      : pending
      ? theme.color.blue
      : theme.color.greyTransparent};
  font-weight: bold;
  font-size: 11px;
  text-align: center;
  line-height: 17px;

  > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const WalletButtonBtn = styled(AccountButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    > svg {
      width: 16px;
      height: 16px;

      @media (min-width: ${ViewportWidth.m}) {
        width: 28px;
        height: 28px;
      }
    }
  }
`;

const TruncatedAddress = styled.span`
  font-family: 'DM Mono', monospace;
  text-transform: none;
`;

export const WalletButton: FC<{ className?: string }> = ({ className }) => {
  const accountItem = useAccountItem();
  const toggleWallet = useToggleWallet();
  const connected = useConnected();
  const account = useWalletAddress();

  const truncatedAddress = useTruncatedAddress(account);
  const connect = useConnect();

  const { pendingCount, latestStatus } = usePendingTxState();
  const pending =
    (!latestStatus && connected && !account) ||
    latestStatus === TransactionStatus.Pending;
  const error = latestStatus === TransactionStatus.Error;
  const success =
    (!latestStatus && connected && account !== undefined) ||
    latestStatus === TransactionStatus.Success;

  return (
    <WalletButtonBtn
      className={className}
      title="Account"
      onClick={connected && account ? toggleWallet : connect}
      active={accountItem === AccountItems.Wallet}
    >
      {connected ? (
        <>
          <Idle>
            <WalletIcon />
          </Idle>
          <TruncatedAddress>{truncatedAddress}</TruncatedAddress>
        </>
      ) : (
        <span>Connect</span>
      )}
      <PendingTxContainer pending={pending} error={error} success={success}>
        <ActivitySpinner pending={pending} error={error} success={success} />
        <div>
          {success && account
            ? '✓'
            : error
            ? '✗'
            : pendingCount === 0
            ? null
            : pendingCount}
        </div>
      </PendingTxContainer>
    </WalletButtonBtn>
  );
};
