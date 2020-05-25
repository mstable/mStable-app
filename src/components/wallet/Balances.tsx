import React, { FC, useContext } from 'react';
import styled, { ThemeContext, DefaultTheme } from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { formatUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';
import { useMusdData } from '../../context/DataProvider/DataProvider';
import { EtherscanLink } from '../core/EtherscanLink';
import { CountUp } from '../core/CountUp';
import { mapSizeToFontSize, Size } from '../../theme';
import { TokenIcon } from '../icons/TokenIcon';
import { List, ListItem } from '../core/List';
import { useSavingsBalance } from '../../web3/hooks';

const Symbol = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 36px;
    margin-right: 8px;
  }
`;

const Balance = styled(CountUp)<{ size?: Size }>`
  font-weight: bold;
  font-size: ${({ size = Size.l }) => mapSizeToFontSize(size)};
`;

// const StyledSkeleton = styled(Skeleton);

const BalanceSkeleton: FC<{ themeContext: DefaultTheme }> = ({
  themeContext: theme,
}) => (
  <SkeletonTheme
    color={theme.color.blueTransparent}
    highlightColor={theme.color.blue}
  >
    <Skeleton width={200} height={30} />
  </SkeletonTheme>
);

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC<{}> = () => {
  const { account } = useWallet();
  const { token: mUsd, bAssets: otherTokens } = useMusdData();
  const savingsBalance = useSavingsBalance(account);
  const themeContext = useContext(ThemeContext);

  return (
    <List inverted>
      <ListItem size={Size.xl} key="mUsdBalance">
        {!mUsd ? (
          <Skeleton height={49} />
        ) : (
          <>
            <Symbol>
              <TokenIcon symbol={mUsd.symbol} />
              <span>{mUsd.symbol}</span>
              <EtherscanLink data={mUsd.address} />
            </Symbol>
            {mUsd.balance == null ? (
              <BalanceSkeleton themeContext={themeContext} />
            ) : (
              <Balance
                size={Size.xl}
                end={parseFloat(formatUnits(mUsd.balance, mUsd.decimals))}
              />
            )}
          </>
        )}
      </ListItem>

      <ListItem size={Size.xl} key="savingsBalance">
        <>
          <Symbol>
            <TokenIcon symbol="mUSD" />
            <span>mUSD Savings</span>
          </Symbol>
          {savingsBalance.simple == null ? (
            <BalanceSkeleton themeContext={themeContext} />
          ) : (
            <Balance size={Size.xl} end={savingsBalance.simple} />
          )}
        </>
      </ListItem>
      {otherTokens.map(({ address, token: { symbol, balance, decimals } }) => (
        <ListItem key={address}>
          <Symbol>
            <TokenIcon symbol={symbol} />
            <span>{symbol}</span>
            <EtherscanLink data={address} />
          </Symbol>
          {balance == null ? (
            <BalanceSkeleton themeContext={themeContext} />
          ) : (
            <Balance end={parseFloat(formatUnits(balance, decimals))} />
          )}
        </ListItem>
      ))}
    </List>
  );
};
