import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { Color, ViewportWidth } from '../../../theme';
import { FormRow } from '../../core/Form';
import { LineItems } from '../../core/LineItems';
import { H3 } from '../../core/Typography';
import { Skeletons } from '../../core/Skeletons';
import { useMintState } from './MintProvider';
import { BassetInput } from './BassetInput';
import { Tooltip } from '../../core/ReactTooltip';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Label = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
`;

const AssetLabel = styled(Label)``;

const AmountLabel = styled(Label)``;

const BalanceLabel = styled(Label)`
  text-align: right;
`;

const Labels = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  padding: 0 8px 8px 8px;

  ${AssetLabel} {
    grid-area: 1 / 1 / 2 / 5;
  }

  ${AmountLabel} {
    display: none;
  }

  ${BalanceLabel} {
    grid-area: 1 / 5 / 2 / 9;
  }

  @media (min-width: ${ViewportWidth.m}) {
    ${AssetLabel} {
      grid-area: 1 / 1 / 3 / 3;
    }

    ${AmountLabel} {
      display: block;
      grid-area: 1 / 3 / 3 / 7;
    }

    ${BalanceLabel} {
      grid-area: 1 / 6 / 3 / 9;
    }
  }
`;

export const MintInput: FC<{}> = () => {
  const {
    mintAmount,
    bAssets,
    initialized,
    dataState,
    simulation,
  } = useMintState();
  const mAsset = dataState?.mAsset;
  const simulatedMassetBalance = simulation?.mAsset.balance.simple || 0;

  const lineItems = useMemo(
    () => [
      {
        id: 'balance',
        label: 'Current balance',
        countUp: {
          end: mAsset?.balance ? mAsset.balance.simple : 0,
        },
        symbol: mAsset?.symbol,
      },
      {
        id: 'mintAmount',
        label: 'Mint amount',
        countUp: {
          end: mintAmount.simple || 0,
          prefix: '+ ',
          highlight: !!mintAmount.simple,
          highlightColor: Color.green,
        },
        symbol: mAsset?.symbol,
      },
      {
        id: 'newBalance',
        label: 'New balance',
        highlight: true,
        countUp: {
          end: simulatedMassetBalance,
          highlight: true,
        },
        symbol: mAsset?.symbol,
      },
    ],
    [mintAmount, mAsset, simulatedMassetBalance],
  );

  return (
    <>
      <FormRow>
        <Header>
          <H3>Send assets</H3>
        </Header>
        <div>
          <Labels>
            <AssetLabel>
              <Tooltip tip="These assets will be used as collateral">
                Asset
              </Tooltip>
            </AssetLabel>
            <AmountLabel>Amount</AmountLabel>
            <BalanceLabel>Your balance</BalanceLabel>
          </Labels>
          <div>
            {!initialized ? (
              <Skeletons skeletonCount={4} height={54} />
            ) : (
              Object.keys(bAssets)
                .sort()
                .map(address => <BassetInput address={address} key={address} />)
            )}
          </div>
        </div>
      </FormRow>
      <FormRow>
        <H3>Receive mUSD</H3>
        {mAsset?.symbol ? (
          <LineItems symbol={mAsset?.symbol} data={lineItems} />
        ) : (
          <Skeleton />
        )}
      </FormRow>
    </>
  );
};
