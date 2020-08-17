import React, { ComponentProps, FC, useCallback } from 'react';
import styled from 'styled-components';

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
import { useBassetState } from '../../../context/DataProvider/DataProvider';
import {
  useToken,
  useTokenAllowance,
} from '../../../context/DataProvider/TokensProvider';
import {
  BalanceContainer,
  Container,
  Error,
  Grid,
  InputContainer,
  Label,
  StyledCountUp,
  TokenContainer,
} from '../../core/BassetInput';

interface Props {
  address: string;
}

const StyledApproveButton = styled(ApproveButton)`
  margin-top: 4px;
`;

export const BassetInput: FC<Props> = ({ address }) => {
  const { decimals, balance, symbol, overweight, mAssetAddress } =
    useBassetState(address) || {};
  const { error, enabled, formValue, reason, amount } =
    useMintBasset(address) || {};
  const mode = useMintMode();
  const toggleBassetEnabled = useMintToggleBassetEnabled();
  const setBassetAmount = useMintSetBassetAmount();
  const setBassetMaxAmount = useMintSetBassetMaxAmount();

  useTokenAllowance(address, mAssetAddress);
  useToken(address);

  const needsUnlock = reason === Reasons.AmountExceedsApprovedAmount;

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof AmountInput>['onChange']>
  >(
    _formValue => {
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
    <Container enabled={enabled} overweight={overweight} valid={!error}>
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
            <div>
              <AmountInput
                disabled={!enabled}
                value={formValue}
                error={error}
                onChange={handleChangeAmount}
              />
              {needsUnlock && mAssetAddress && amount ? (
                <StyledApproveButton
                  address={address}
                  spender={mAssetAddress}
                  amount={amount}
                />
              ) : null}
            </div>
          ) : null}
          {enabled && mode === Mode.MintSingle ? (
            <Button onClick={setBassetMaxAmount} type="button">
              Max
            </Button>
          ) : null}
        </InputContainer>
        <StyledCountUp
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
