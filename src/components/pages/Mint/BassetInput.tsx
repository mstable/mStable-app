import React, { ComponentProps, FC, useCallback } from 'react';
import styled from 'styled-components';

import { CountUp as CountUpBase } from '../../core/CountUp';
import { Button } from '../../core/Button';
import { Token } from '../../core/Token';
import { ToggleInput } from '../../forms/ToggleInput';
import { ApproveButton } from '../../forms/ApproveButton';
import { Mode, Reasons } from './types';
import {
  useMintBasset,
  useMintMode,
  useMintSetBassetAmount,
  useMintSetBassetMaxAmount,
  useMintToggleBassetEnabled,
} from './MintProvider';
import { AmountInput } from '../../forms/AmountInput';
import { FontSize, ViewportWidth } from '../../../theme';
import { useBassetState } from '../../../context/DataProvider/DataProvider';

interface Props {
  address: string;
}

const CountUp = styled(CountUpBase)`
  display: block;
  text-align: right;
`;

const TokenContainer = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    padding-right: 8px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    margin-right: 8px;
  }

  > :last-child {
    margin-right: 0;
  }

  input {
    margin-bottom: 0;
    height: 100%;
  }
`;

const Error = styled.div`
  padding-top: 8px;
  font-size: ${FontSize.s};
  color: ${({ theme }) => theme.color.red};
`;

const Label = styled.div`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: bold;
  text-transform: uppercase;

  @media (min-width: ${ViewportWidth.m}) {
    display: none;
  }
`;

const BalanceContainer = styled.div``;

const Grid = styled.div<{ enabled?: boolean }>`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0 8px;
  align-items: center;

  ${TokenContainer} {
    grid-area: 1 / 1 / 2 / 5;
  }

  ${InputContainer} {
    grid-area: 2 / 1 / 3 / 9;
    overflow: hidden;
    transition: all 0.4s ease;
    opacity: ${({ enabled }) => (enabled ? 1 : 0)};
    max-height: ${({ enabled }) => (enabled ? '50px' : 0)};
    padding-top: ${({ enabled }) => (enabled ? '8px' : 0)};
  }

  ${BalanceContainer} {
    grid-area: 1 / 5 / 2 / 9;
  }

  @media (min-width: ${ViewportWidth.m}) {
    ${TokenContainer} {
      grid-area: 1 / 1 / 3 / 3;
    }

    ${InputContainer} {
      grid-area: 1 / 3 / 3 / 7;
      opacity: 1;
      max-height: 100%;
      padding-top: 0;
    }

    ${BalanceContainer} {
      grid-area: 1 / 7 / 3 / 9;
    }
  }
`;

const Container = styled.div<{
  valid: boolean;
  overweight?: boolean;
}>`
  border: 1px
    ${({ theme, valid }) =>
      valid ? theme.color.blackTransparent : theme.color.redTransparent}
    solid;
  border-radius: 3px;
  background: ${({ theme, overweight }) =>
    overweight ? theme.color.blackTransparenter : theme.color.white};
  padding: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 8px;
`;

export const BassetInput: FC<Props> = ({ address }) => {
  const { decimals, balance, symbol, overweight, mAssetAddress } =
    useBassetState(address) || {};
  const { error, enabled, formValue } = useMintBasset(address) || {};
  const mode = useMintMode();
  const toggleBassetEnabled = useMintToggleBassetEnabled();
  const setBassetAmount = useMintSetBassetAmount();
  const setBassetMaxAmount = useMintSetBassetMaxAmount();

  const needsUnlock = error === Reasons.AmountExceedsApprovedAmount;

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof AmountInput>['onChange']>
  >(
    (_, _formValue) => {
      setBassetAmount(address, _formValue);
    },
    [setBassetAmount, address],
  );

  const handleClickInput = useCallback(() => {
    if (!enabled && !overweight) {
      toggleBassetEnabled(address);
    }
  }, [enabled, address, toggleBassetEnabled, overweight]);

  return (
    <Container overweight={overweight} valid={!error}>
      <Grid enabled={enabled}>
        <TokenContainer>
          <ToggleInput
            disabled={overweight}
            onClick={() => toggleBassetEnabled(address)}
            checked={enabled}
          />
          {symbol ? <Token symbol={symbol} /> : null}
        </TokenContainer>
        <InputContainer onClick={handleClickInput}>
          <Label>Amount</Label>
          {decimals ? (
            <AmountInput
              disabled={!enabled}
              value={formValue}
              error={error}
              name={address}
              onChange={handleChangeAmount}
            />
          ) : null}
          {needsUnlock && mAssetAddress ? (
            <ApproveButton address={address} spender={mAssetAddress} />
          ) : null}
          {enabled && mode === Mode.MintSingle ? (
            <Button onClick={setBassetMaxAmount} size={1} type="button">
              Max
            </Button>
          ) : null}
        </InputContainer>
        <CountUp
          container={BalanceContainer}
          end={balance?.simpleRounded || 0}
        />
      </Grid>
      {error || overweight ? (
        <Error>{error || 'Asset overweight'}</Error>
      ) : null}
    </Container>
  );
};
