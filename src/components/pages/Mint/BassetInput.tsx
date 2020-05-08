import React, { FC, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'ethers/utils';
import { Basset, BassetStatus, Dispatch } from './types';
import { Button } from '../../core/Button';
import { Size } from '../../../theme';
import { TokenIcon } from '../../icons/TokenIcon';
import { ToggleInput } from '../../forms/ToggleInput';
import { useTokenWithBalance } from '../../../context/TokensProvider';
import { CountUp as CountUpBase } from '../../core/CountUp';

interface Props {
  basset: Basset;
  setBassetBalance: Dispatch['setBassetBalance'];
  setError: Dispatch['setError'];
  handleToggle(address: string): void;
  handleUnlock(address: string): void;
  massetAddress: string | null;
  toggleDisabled: boolean;
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

const ToggleRow = styled(Row)``;

const ValidationRow = styled(Row)`
  min-height: 60px;
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

const Value = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const ApproveButton = styled(Button)`
  width: 100%;
  margin-bottom: 8px;
`;

const Rows = styled.div<{
  enabled: boolean;
  valid: boolean;
  overweight: boolean;
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

const Container = styled.div``;

export const BassetInput: FC<Props> = ({
  basset: { address, enabled, amount, error, maxWeight, status, overweight },
  handleUnlock,
  handleToggle,
  massetAddress,
  setBassetBalance,
  setError,
  toggleDisabled,
}) => {
  const unlock = useCallback(() => {
    handleUnlock(address);
  }, [handleUnlock, address]);

  const toggle = useCallback(() => {
    handleToggle(address);
  }, [handleToggle, address]);

  const { allowance } = useTokenWithBalance(massetAddress);
  const { balance, symbol, decimals } = useTokenWithBalance(address);

  const simpleBalance = useMemo<number>(
    () =>
      balance && decimals ? parseFloat(formatUnits(balance, decimals)) : 0,
    [balance, decimals],
  );

  const needsUnlock = useMemo<boolean>(
    () => allowance?.[address]?.lte(0) || false,
    [address, allowance],
  );

  useEffect(() => {
    if (balance) setBassetBalance(address, balance);
  }, [address, balance, setBassetBalance]);

  useEffect(() => {
    if (!amount.exact) return;

    if (amount.exact.gt(0) && status === BassetStatus.Failed) {
      setError('Asset failed', address);
      return;
    }

    if (balance && amount.exact.gt(balance)) {
      setError('Insufficient balance', address);
      return;
    }

    if (allowance?.[address] && amount.exact.gt(allowance[address])) {
      setError('Amount exceeds allowance', address);
      return;
    }

    if (amount.exact.gt(maxWeight)) {
      setError('Amount exceeds max weight', address);
      return;
    }

    setError(null, address);
  }, [address, allowance, amount, balance, maxWeight, setError, status]);

  return (
    <Container>
      <Rows overweight={overweight} enabled={enabled} valid={error === null}>
        <HeaderRow>
          <TokenContainer>
            {symbol ? <TokenIcon symbol={symbol} /> : null}
            <Symbol>{symbol}</Symbol>
          </TokenContainer>
          <ToggleInput
            onClick={toggle}
            disabled={toggleDisabled}
            checked={enabled}
          />
        </HeaderRow>
        <Row>
          <Label>Amount</Label>
          <CountUp duration={0.4} end={amount.simple || 0} />
        </Row>
        <Row>
          <Label>Your Balance</Label>
          <CountUp end={simpleBalance} />
        </Row>
      </Rows>
      <ValidationRow>
        {needsUnlock ? (
          <ApproveButton size={Size.s} onClick={unlock}>
            Approve
          </ApproveButton>
        ) : null}
        {error || overweight ? (
          <>
            <Label>Unable to mint</Label>
            <Value>{error || 'Asset overweight'}</Value>
          </>
        ) : null}
      </ValidationRow>
    </Container>
  );
};
