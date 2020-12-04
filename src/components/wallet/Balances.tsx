import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useDataState } from '../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../context/TokensProvider';
import { EtherscanLink } from '../core/EtherscanLink';
import { CountUp } from '../core/CountUp';
import { mapSizeToFontSize, Size } from '../../theme';
import { TokenIcon as TokenIconBase } from '../icons/TokenIcon';
import { List, ListItem } from '../core/List';
import { MassetState } from '../../context/DataProvider/types';

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
  font-size: ${({ size = Size.m }) => mapSizeToFontSize(size)};
`;

const TokenIcon = styled(TokenIconBase)<{ outline?: boolean }>`
  ${({ outline }) =>
    outline ? `border: 1px white solid; border-radius: 100%` : ''}
`;

const TokenBalance: FC<{ address: string; size?: Size }> = ({
  address,
  size = Size.m,
}) => {
  const token = useTokenSubscription(address);
  return token ? (
    <Balance size={size} end={token.balance.simple} />
  ) : (
    <Skeleton />
  );
};

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC = () => {
  const dataState = useDataState();

  const massetTokens = useMemo(
    () =>
      Object.values(dataState).map(
        ({
          token: masset,
          bAssets,
          savingsContracts: { v1, v2 },
        }: MassetState) => ({
          masset,
          bassets: Object.values(bAssets).map(b => b.token),
          savingsContractV1: v1
            ? {
                name: `${masset.symbol} Save v1`,
                symbol: masset.symbol,
                address: v1.address,
                decimals: masset.decimals,
                savingsBalance: v1.savingsBalance,
              }
            : undefined,
          savingsContractV2: v2 && v2.token ? v2.token : undefined,
        }),
      ),
    [dataState],
  );

  return (
    <List inverted>
      {massetTokens.map(
        ({ masset, bassets, savingsContractV1, savingsContractV2 }) => (
          <>
            <ListItem size={Size.l} key={masset.address}>
              <Symbol>
                <TokenIcon symbol={masset.symbol} outline />
                <span>{masset.symbol}</span>
                <EtherscanLink data={masset.address} />
              </Symbol>
              <TokenBalance address={masset.address} size={Size.l} />
            </ListItem>
            {savingsContractV1 && (
              <ListItem key={savingsContractV1.address}>
                <Symbol>
                  <TokenIcon symbol={savingsContractV1.symbol} outline />
                  <span>{savingsContractV1.name}</span>
                </Symbol>
                {savingsContractV1.savingsBalance.balance ? (
                  <Balance
                    size={Size.l}
                    end={savingsContractV1.savingsBalance.balance.simple}
                  />
                ) : (
                  <Skeleton />
                )}
              </ListItem>
            )}
            {savingsContractV2 && (
              <ListItem key={savingsContractV2.address}>
                <Symbol>
                  <TokenIcon symbol={savingsContractV2.symbol} outline />
                  <span>{savingsContractV2.symbol}</span>
                </Symbol>
                <TokenBalance address={masset.address} size={Size.l} />
              </ListItem>
            )}
            {bassets.map(({ address, symbol }) => (
              <ListItem key={address}>
                <Symbol>
                  <TokenIcon symbol={symbol} />
                  <span>{symbol}</span>
                  <EtherscanLink data={address} />
                </Symbol>
                <TokenBalance address={address} />
              </ListItem>
            ))}
          </>
        ),
      )}
    </List>
  );
};
