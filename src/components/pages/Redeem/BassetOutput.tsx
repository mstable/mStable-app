import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { formatUnits } from 'ethers/utils';

import { Color } from '../../../theme';
import { CountUp as CountUpBase } from '../../core/CountUp';
import { Token } from '../../core/Token';
import { ToggleInput } from '../../forms/ToggleInput';
import { useBassetData } from '../../../context/DataProvider/DataProvider';
import { useRedeemBassetData, useRedeemBassetOutput } from './RedeemProvider';
import { EXP_SCALE } from '../../../web3/constants';
import { parseExactAmount } from '../../../web3/amounts';

interface Props {
  address: string;
  applyFee: boolean;
  feeRate?: string | null;
  toggleDisabled: boolean;
  handleToggle(address: string): void;
}

const CountUp = styled(CountUpBase)`
  display: block;
  text-align: right;
`;

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

const ToggleRow = styled(Row)``;

const ErrorRow = styled(Row)`
  margin-bottom: 8px;
`;

const Value = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const Rows = styled.div<{
  valid: boolean;
  overweight?: boolean;
  enabled?: boolean;
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

  ${Row} > * {
    opacity: ${({ enabled }) => (enabled ? '1' : '0.3')};
  }

  ${ToggleRow} > * {
    opacity: 1;
  }
`;

export const BassetOutput: FC<Props> = ({
  address,
  handleToggle,
  toggleDisabled,
  applyFee,
  feeRate,
}) => {
  const bassetData = useRedeemBassetData(address);
  const { error, enabled, amount } = useRedeemBassetOutput(address) || {};
  const { overweight, token } = useBassetData(address) || {};

  const amountAfterFee =
    applyFee && feeRate && amount?.exact && token?.decimals
      ? parseExactAmount(
          amount.exact.sub(amount.exact.mul(feeRate).div(EXP_SCALE)),
          token.decimals,
        )
      : amount;

  const balance = bassetData?.token?.balance;
  const decimals = bassetData?.token?.decimals;

  const simpleBalance = useMemo<number>(
    () =>
      balance && decimals ? parseFloat(formatUnits(balance, decimals)) : 0,
    [balance, decimals],
  );

  const toggle = useCallback(() => {
    handleToggle(address);
  }, [handleToggle, address]);

  return (
    <div>
      <Rows valid={!error} enabled={enabled} overweight={overweight}>
        <HeaderRow>
          {bassetData?.token?.symbol ? (
            <Token symbol={bassetData.token.symbol} />
          ) : (
            <Skeleton />
          )}
          <ToggleInput
            onClick={toggle}
            disabled={toggleDisabled}
            checked={!!enabled}
          />
        </HeaderRow>
        <Row>
          <Label>Your Balance</Label>
          <CountUp end={simpleBalance} />
        </Row>
        <Row>
          <Label>Amount</Label>
          <CountUp
            highlight={(amountAfterFee?.simple || 0) > 0}
            highlightColor={Color.green}
            duration={0.4}
            end={amountAfterFee?.simple || 0}
            prefix="+ "
          />
        </Row>
      </Rows>
      {error ? (
        <ErrorRow>
          <Label>Unable to redeem</Label>
          <Value>{error}</Value>
        </ErrorRow>
      ) : null}
    </div>
  );
};
