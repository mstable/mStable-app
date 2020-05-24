import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { formatUnits } from 'ethers/utils';
import { CountUp as CountUpBase } from '../../core/CountUp';
import { TokenIcon } from '../../icons/TokenIcon';
import { useRedeemBassetData, useRedeemBassetOutput } from './RedeemProvider';

interface Props {
  address: string;
}

const CountUp = styled(CountUpBase)<{
  highlight?: boolean;
}>`
  display: block;
  text-align: right;
  color: ${({ theme, highlight }) =>
    highlight ? theme.color.green : theme.color.offBlack};
  font-weight: ${({ highlight }) => (highlight ? '600' : '400')};
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
  const bassetData = useRedeemBassetData(address);
  const bassetOutput = useRedeemBassetOutput(address);

  const balance = bassetData?.token?.balance;

  const simpleBalance = useMemo<number>(
    () =>
      balance && bassetData?.token.decimals
        ? parseFloat(formatUnits(balance, bassetData.token.decimals))
        : 0,
    [balance, bassetData],
  );

  return (
    <div>
      <Rows valid>
        <HeaderRow>
          <TokenContainer>
            {!bassetData?.token?.symbol ? (
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
          <CountUp
            highlight={(bassetOutput?.amount.simple || 0) > 0}
            duration={0.4}
            end={bassetOutput?.amount.simple || 0}
            prefix="+ "
          />
        </Row>
        <Row>
          <Label>Your Balance</Label>
          <CountUp end={simpleBalance} />
        </Row>
      </Rows>
    </div>
  );
};
