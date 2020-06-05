import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'ethers/utils';

import { CountUp as CountUpBase } from '../../core/CountUp';
import { Button } from '../../core/Button';
import { Token } from '../../core/Token';
import { ToggleInput } from '../../forms/ToggleInput';
import { ApproveButton } from '../../forms/ApproveButton';
import { Mode, Reasons } from './types';
import {
  useMintBassetData,
  useMintBassetInput,
  useMintMassetToken,
  useMintMode,
  useMintSetBassetAmount,
  useMintSetBassetMaxAmount,
  useMintToggleBassetEnabled,
} from './MintProvider';
import { AmountInput } from '../../forms/AmountInput';
import { parseAmount } from '../../../web3/amounts';
import { FontSize, ViewportWidth } from '../../../theme';

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
  background: ${({ theme, valid, overweight }) =>
    overweight
      ? theme.color.blackTransparenter
      : valid
      ? theme.color.white
      : theme.color.redTransparenter};
  padding: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 8px;
`;

export const BassetInput: FC<Props> = ({ address }) => {
  const { overweight, token } = useMintBassetData(address) || {};
  const { error, enabled, formValue } = useMintBassetInput(address) || {};
  const mode = useMintMode();
  const mAssetToken = useMintMassetToken();
  const toggleBassetEnabled = useMintToggleBassetEnabled();
  const setBassetAmount = useMintSetBassetAmount();
  const setBassetMaxAmount = useMintSetBassetMaxAmount();

  const mAssetAddress = mAssetToken?.address;

  const simpleBalance = useMemo<number>(
    () =>
      token?.balance && token.decimals
        ? parseFloat(formatUnits(token.balance, token.decimals))
        : 0,
    [token],
  );

  const needsUnlock = error === Reasons.AmountExceedsApprovedAmount;

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof AmountInput>['onChange']>
  >(
    (_, _formValue) => {
      if (token) {
        setBassetAmount(
          address,
          _formValue,
          parseAmount(_formValue, token.decimals),
        );
      }
    },
    [setBassetAmount, token, address],
  );

  const handleClickInput = useCallback(() => {
    if (!enabled) {
      toggleBassetEnabled(address);
    }
  }, [enabled, address, toggleBassetEnabled]);

  return (
    <Container overweight={overweight} valid={!error}>
      <Grid enabled={enabled}>
        <TokenContainer>
          <ToggleInput
            onClick={() => toggleBassetEnabled(address)}
            checked={enabled}
          />
          {token?.symbol ? <Token symbol={token.symbol} /> : null}
        </TokenContainer>
        <InputContainer onClick={handleClickInput}>
          <Label>Amount</Label>
          {token?.decimals ? (
            <AmountInput
              disabled={!enabled}
              value={formValue || null}
              decimals={token?.decimals}
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
        <CountUp container={BalanceContainer} end={simpleBalance} />
      </Grid>
      {error || overweight ? (
        <Error>{error || 'Asset overweight'}</Error>
      ) : null}
    </Container>
  );
};
