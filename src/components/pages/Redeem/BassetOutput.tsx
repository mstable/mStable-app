import React, { ComponentProps, FC, useCallback } from 'react';

import { AmountInput } from '../../forms/AmountInput';
import { InlineTokenAmountInput } from '../../forms/InlineTokenAmountInput';
import {
  useRedeemDispatch,
  useRedeemMode,
  useRedeemState,
} from './RedeemProvider';
import { Mode } from './types';

interface Props {
  address: string;
}

export const BassetOutput: FC<Props> = ({ address }) => {
  const {
    error,
    bAssets: {
      [address]: { hasError, enabled, formValue, amount },
    },
    massetState: {
      bAssets: {
        [address]: {
          token: { symbol },
          overweight,
        },
      } = {},
      overweightBassets = [],
    } = {},
  } = useRedeemState();

  const mode = useRedeemMode();
  const { toggleBassetEnabled, setBassetAmount } = useRedeemDispatch();

  const cannotRedeem = !!(
    mode !== Mode.RedeemMasset &&
    overweightBassets.length > 0 &&
    overweightBassets.find(b => b !== address)
  );

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof AmountInput>['onChange']>
  >(
    _formValue => {
      setBassetAmount(address, _formValue);
    },
    [setBassetAmount, address],
  );

  const handleClickAmount = useCallback(() => {
    if (!enabled && !cannotRedeem) {
      toggleBassetEnabled(address);
    }
  }, [enabled, address, toggleBassetEnabled, cannotRedeem]);

  return (
    <InlineTokenAmountInput
      valid={!hasError}
      error={hasError ? error?.message : undefined}
      overweight={overweight}
      amount={{
        value: amount,
        formValue,
        disabled: mode === Mode.RedeemMasset,
        handleChange: handleChangeAmount,
        handleClick: handleClickAmount,
      }}
      token={{
        address,
        disabled: true,
      }}
      toggle={{
        enabled,
        canEnable: !cannotRedeem,
        handleToggle: () => toggleBassetEnabled(address),
        reasonCannotEnable:
          cannotRedeem && symbol
            ? `It is not possible to redeem with ${symbol}, because other assets are overweight`
            : undefined,
      }}
    />
  );
};
