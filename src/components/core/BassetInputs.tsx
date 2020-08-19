import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../theme';
import { Tooltip } from './ReactTooltip';
import { Skeletons } from './Skeletons';

interface Props {
  initialized: boolean;
  bAssets: { [address: string]: unknown };
  assetTooltip: string;
  Input: FC<{ address: string }>;
}

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

export const BassetInputs: FC<Props> = ({
  initialized,
  bAssets,
  assetTooltip,
  Input,
}) => (
  <div>
    <Labels>
      <AssetLabel>
        <Tooltip tip={assetTooltip}>Asset</Tooltip>
      </AssetLabel>
      <AmountLabel>Amount</AmountLabel>
      <BalanceLabel>Your balance</BalanceLabel>
    </Labels>
    <div>
      {!initialized ? (
        <Skeletons skeletonCount={Object.keys(bAssets).length} height={54} />
      ) : (
        Object.keys(bAssets)
          .sort()
          .map(address => <Input address={address} key={address} />)
      )}
    </div>
  </div>
);
