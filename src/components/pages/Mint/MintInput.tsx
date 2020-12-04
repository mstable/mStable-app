import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { Color } from '../../../theme';
import { FormRow } from '../../core/Form';
import { LineItems } from '../../core/LineItems';
import { H3 } from '../../core/Typography';
import { useMintState } from './MintProvider';
import { BassetInput } from './BassetInput';
import { BassetInputs } from '../../core/BassetInputs';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const MintInput: FC = () => {
  const {
    mintAmount,
    bAssets,
    initialized,
    massetState,
    simulation,
  } = useMintState();
  const simulatedMassetBalance = simulation?.token.balance.simple || 0;

  const lineItems = useMemo(
    () =>
      massetState
        ? [
            {
              id: 'balance',
              label: 'Current balance',
              countUp: {
                end: massetState.token.balance
                  ? massetState.token.balance.simple
                  : 0,
              },
              symbol: massetState.token.symbol,
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
              symbol: massetState.token.symbol,
            },
            {
              id: 'newBalance',
              label: 'New balance',
              highlight: true,
              countUp: {
                end: simulatedMassetBalance,
                highlight: true,
              },
              symbol: massetState.token.symbol,
            },
          ]
        : [],
    [mintAmount, massetState, simulatedMassetBalance],
  );

  return (
    <>
      <FormRow>
        <Header>
          <H3>Send assets</H3>
        </Header>
        <BassetInputs
          initialized={initialized}
          bAssets={bAssets}
          assetTooltip="These assets will be used as collateral"
          Input={BassetInput}
        />
      </FormRow>
      <FormRow>
        <H3>Receive mUSD</H3>
        {massetState ? (
          <LineItems symbol={massetState.token.symbol} data={lineItems} />
        ) : (
          <Skeleton />
        )}
      </FormRow>
    </>
  );
};
