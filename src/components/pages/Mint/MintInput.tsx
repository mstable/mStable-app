import React, { FC, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { BigNumber, formatUnits } from 'ethers/utils';

import { RATIO_SCALE, SCALE } from '../../../web3/constants';
import { Color, ViewportWidth } from '../../../theme';
import { FormRow } from '../../core/Form';
import { LineItems } from '../../core/LineItems';
import { H3 } from '../../core/Typography';
import { Skeletons } from '../../core/Skeletons';
import { useMintState, useMintDispatch } from './MintProvider';
import { BassetInput } from './BassetInput';

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
  const { mintAmount, bAssetInputs, mAssetData } = useMintState();
  const { toggleBassetEnabled } = useMintDispatch();
  const mAssetToken = mAssetData?.token;

  const firstLoad = useRef(true);

  const loading: boolean = mAssetData == null ? true : mAssetData?.loading;
  const bAssets = mAssetData?.bAssets;

  useEffect(() => {
    if (firstLoad.current && !loading && bAssets && bAssets.length > 0) {
      const underweightBassets = bAssets.filter(
        b => !b.overweight && b.token && b.token.balance && b.ratio,
      ) as {
        address: string;
        token: { balance: BigNumber };
        ratio: string;
      }[];
      const [first] = underweightBassets.sort(
        (a, b) =>
          b.token.balance
            .mul(b.ratio)
            .div(RATIO_SCALE)
            .div(SCALE)
            .toNumber() -
          a.token.balance
            .mul(a.ratio)
            .div(RATIO_SCALE)
            .div(SCALE)
            .toNumber(),
      );
      if (first) {
        toggleBassetEnabled(first.address);
        firstLoad.current = false;
      }
    }
  }, [firstLoad, loading, bAssets, toggleBassetEnabled]);

  const lineItems = useMemo(
    () => [
      {
        id: 'balance',
        label: 'Current balance',
        countUp: {
          end: mAssetToken?.balance
            ? parseFloat(formatUnits(mAssetToken.balance, mAssetToken.decimals))
            : 0,
        },
        symbol: mAssetToken?.symbol,
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
        symbol: mAssetToken?.symbol,
      },
      {
        id: 'newBalance',
        label: 'New balance',
        highlight: true,
        countUp: {
          end:
            mAssetToken?.balance && mintAmount.exact
              ? parseFloat(
                  formatUnits(
                    mAssetToken.balance.add(mintAmount.exact),
                    mAssetToken.decimals,
                  ),
                )
              : 0,
          highlight: true,
        },
        symbol: mAssetToken?.symbol,
      },
    ],
    [mintAmount, mAssetToken],
  );

  return (
    <>
      <FormRow>
        <Header>
          <H3>Send</H3>
        </Header>
        <div>
          <Labels>
            <AssetLabel>Asset</AssetLabel>
            <AmountLabel>Amount</AmountLabel>
            <BalanceLabel>Your balance</BalanceLabel>
          </Labels>
          <div>
            {loading || !bAssetInputs ? (
              <Skeletons skeletonCount={4} height={54} />
            ) : (
              bAssetInputs.map(b => (
                <BassetInput address={b.address} key={b.address} />
              ))
            )}
          </div>
        </div>
      </FormRow>
      <FormRow>
        <H3>Receive</H3>
        {mAssetToken?.symbol ? (
          <LineItems symbol={mAssetToken?.symbol} data={lineItems} />
        ) : (
          <Skeleton />
        )}
      </FormRow>
    </>
  );
};
