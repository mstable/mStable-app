import React, { FC, useContext } from 'react';
import styled, { ThemeContext, DefaultTheme } from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { formatUnits } from 'ethers/utils';

import {
  useMusdData,
  useSavingsBalance,
} from '../../context/DataProvider/DataProvider';
import { EtherscanLink } from '../core/EtherscanLink';
import { CountUp } from '../core/CountUp';
import { mapSizeToFontSize, Size } from '../../theme';
import { TokenIcon as TokenIconBase } from '../icons/TokenIcon';
import { List, ListItem } from '../core/List';

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

const TokenIcon = styled(TokenIconBase)<{ outline?: boolean }>`
  ${({ outline }) =>
    outline ? `border: 1px white solid; border-radius: 100%` : ''}
`;

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
  const { token: mUsd, bAssets: otherTokens = [] } = useMusdData() || {};
  const savingsBalance = useSavingsBalance();
  const themeContext = useContext(ThemeContext);

  return (
    <List inverted>
      <ListItem size={Size.xl} key="mUsdBalance">
        {!mUsd ? (
          <Skeleton height={49} />
        ) : (
          <>
            <Symbol>
              <TokenIcon symbol={mUsd.symbol} outline />
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
            <TokenIcon symbol="mUSD" outline />
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
            <TokenIcon symbol={symbol} outline={symbol === 'mUSD'} />
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
