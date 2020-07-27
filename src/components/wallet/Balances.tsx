import React, {
  FC,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled, { ThemeContext, DefaultTheme } from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { useDataState } from '../../context/DataProvider/DataProvider';
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
  const [loading, setLoading] = useState(true);

  const { mAsset, savingsContract, bAssets } = useDataState() || {};

  const otherTokens = useMemo(() => (bAssets ? Object.values(bAssets) : []), [
    bAssets,
  ]);

  const themeContext = useContext(ThemeContext);

  // Use a layout effect to prevent CountUp from running if the component
  // is quickly unmounted (e.g. on login)
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
    return (): void => {
      clearTimeout(timeout);
    };
  }, [loading, setLoading]);

  return (
    <List inverted>
      <ListItem size={Size.xl} key="mUsdBalance">
        {!mAsset ? (
          <Skeleton height={49} />
        ) : (
          <>
            <Symbol>
              <TokenIcon symbol={mAsset.symbol} outline />
              <span>{mAsset.symbol}</span>
              <EtherscanLink data={mAsset.address} />
            </Symbol>
            {!mAsset.balance ? (
              <BalanceSkeleton themeContext={themeContext} />
            ) : (
              <Balance size={Size.xl} end={mAsset.balance.simple} />
            )}
          </>
        )}
      </ListItem>

      <ListItem key="savingsBalance">
        <>
          <Symbol>
            <TokenIcon symbol="mUSD" outline />
            <span>mUSD Savings</span>
          </Symbol>
          {loading || !savingsContract?.savingsBalance.balance?.simple ? (
            <BalanceSkeleton themeContext={themeContext} />
          ) : (
            <Balance
              size={Size.xl}
              end={savingsContract.savingsBalance.balance.simple}
            />
          )}
        </>
      </ListItem>
      {otherTokens.map(({ address, symbol, balance }) => (
        <ListItem key={address}>
          <Symbol>
            <TokenIcon symbol={symbol} outline={symbol === 'mUSD'} />
            <span>{symbol}</span>
            <EtherscanLink data={address} />
          </Symbol>
          {balance ? (
            <Balance end={balance.simple} />
          ) : (
            <BalanceSkeleton themeContext={themeContext} />
          )}
        </ListItem>
      ))}
    </List>
  );
};
