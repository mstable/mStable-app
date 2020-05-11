import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { formatUnits } from 'ethers/utils';
import { CountUp as CountUpBase } from '../../core/CountUp';
import { useTokenBalance } from '../../../context/TokensProvider';
import { TokenIcon } from '../../icons/TokenIcon';
import { useExitBassetData, useExitBassetOutput } from './ExitProvider';

interface Props {
  address: string;
}

const CountUp = styled(CountUpBase)`
  display: block;
  text-align: right;
`;

const Symbol = styled.div``;

const Row = styled.div`
  padding: 8px 0;
  border-bottom: 1px ${({ theme }) => theme.color.blackTransparent} solid;

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    border-bottom: 0;
  }

  > * {
    transition: opacity 0.4s ease;
  }
`;

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.l};
  font-weight: bold;

  img {
    width: 36px;
    height: 36px;
    padding-right: 4px;
  }
`;

const HeaderRow = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    opacity: 1 !important;
  }
`;

const Label = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: bold;
  text-transform: uppercase;
`;

const Rows = styled.div<{
  valid: boolean;
  overweight?: boolean;
}>`
  border: 1px
    ${({ theme, valid }) =>
      valid ? theme.color.blackTransparent : theme.color.redTransparent}
    solid;
  border-radius: 3px;
  background: ${({ theme, valid, overweight }) =>
    overweight
      ? theme.color.blackTransparenter
      : valid
      ? theme.color.white
      : theme.color.redTransparenter};
  padding: ${({ theme }) => theme.spacing.xs};
`;

export const BassetOutput: FC<Props> = ({ address }) => {
  const balance = useTokenBalance(address);
  const bassetData = useExitBassetData(address);
  const bassetOption = useExitBassetOutput(address);

  const simpleBalance = useMemo<number>(
    () =>
      balance && bassetData
        ? parseFloat(formatUnits(balance, bassetData.token.decimals))
        : 0,
    [balance, bassetData],
  );

  return (
    <div>
      <Rows valid>
        <HeaderRow>
          <TokenContainer>
            {!bassetData ? (
              <Skeleton />
            ) : (
              <>
                <TokenIcon symbol={bassetData.token.symbol} />
                <Symbol>{bassetData.token.symbol}</Symbol>
              </>
            )}
          </TokenContainer>
        </HeaderRow>
        <Row>
          <Label>Amount</Label>
          <CountUp duration={0.4} end={bassetOption?.amount.simple || 0} />
        </Row>
        <Row>
          <Label>Your Balance</Label>
          <CountUp end={simpleBalance} />
        </Row>
      </Rows>
    </div>
  );
};
