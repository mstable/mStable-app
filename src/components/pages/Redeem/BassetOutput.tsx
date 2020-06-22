import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { Color } from '../../../theme';
import { CountUp as CountUpBase } from '../../core/CountUp';
import { Token } from '../../core/Token';
import { ToggleInput } from '../../forms/ToggleInput';
import { useDataState } from '../../../context/DataProvider/DataProvider';
import {
  useRedeemBassetData,
  useRedeemBassetOutput,
  useRedeemMode,
  useToggleBassetEnabled,
} from './RedeemProvider';
import { Mode } from './types';

interface Props {
  address: string;
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

export const BassetOutput: FC<Props> = ({ address }) => {
  const { overweight, balance, symbol } = useRedeemBassetData(address) || {};
  const { error, enabled, amount } = useRedeemBassetOutput(address) || {};
  const mode = useRedeemMode();
  const toggle = useToggleBassetEnabled();
  const toggleDisabled = mode === Mode.RedeemSingle && overweight;

  return (
    <div>
      <Rows valid={!error} enabled={enabled} overweight={overweight}>
        <HeaderRow>
          {symbol ? <Token symbol={symbol} /> : <Skeleton />}
          <ToggleInput
            onClick={() => toggle(address)}
            disabled={toggleDisabled}
            checked={!!enabled}
          />
        </HeaderRow>
        <Row>
          <Label>Your Balance</Label>
          <CountUp end={balance?.simpleRounded || 0} />
        </Row>
        <Row>
          <Label>Amount</Label>
          <CountUp
            highlight={(amount?.simpleRounded || 0) > 0}
            highlightColor={Color.green}
            duration={0.4}
            end={amount?.simple || 0}
            prefix="+ "
          />
        </Row>
      </Rows>
      {error || overweight ? (
        <ErrorRow>
          {error ? <Label>Unable to redeem</Label> : null}
          <Value>{error || 'Asset overweight'}</Value>
        </ErrorRow>
      ) : null}
    </div>
  );
};
