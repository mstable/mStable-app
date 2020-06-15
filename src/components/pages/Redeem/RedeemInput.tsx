import React, { FC, useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { Skeletons } from '../../core/Skeletons';
import { BassetsGrid } from '../../core/Bassets';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { ToggleInput } from '../../forms/ToggleInput';
import { useRedeemDispatch, useRedeemState } from './RedeemProvider';
import { BassetOutput } from './BassetOutput';
import { Mode } from './types';

const RedeemMode = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin-right: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const RedeemInput: FC<{}> = () => {
  const {
    feeAmount,
    formValue,
    bAssets,
    dataState,
    initialized,
    error,
    mode,
    valid,
  } = useRedeemState();
  const {
    setMaxRedemptionAmount,
    setRedemptionAmount,
    toggleMode,
  } = useRedeemDispatch();

  const mAsset = dataState?.mAsset;

  const items = useMemo(() => {
    const balance = {
      label: 'Balance',
      value: mAsset?.balance.format(),
    };

    return feeAmount && valid
      ? [
          balance,
          {
            label: 'NOTE',
            value: 'Swap fee applies (see details below)',
          },
        ]
      : [balance];
  }, [mAsset, feeAmount, valid]);

  const handleSetAmount = useCallback(
    (_, _formValue) => {
      setRedemptionAmount(_formValue);
    },
    [setRedemptionAmount],
  );

  return (
    <>
      <FormRow>
        <Header>
          <H3>Send</H3>
          <RedeemMode>
            <ToggleInput
              onClick={toggleMode}
              checked={mode === Mode.RedeemMasset}
            />
            <span>Redeem with all bAssets</span>
          </RedeemMode>
        </Header>
        {initialized && mAsset ? (
          <TokenAmountInput
            name="redemption"
            tokenValue={mAsset.address}
            amountValue={formValue || null}
            tokenAddresses={[mAsset.address]}
            onChangeAmount={handleSetAmount}
            onSetMax={
              mode === Mode.RedeemMasset ? setMaxRedemptionAmount : undefined
            }
            items={items}
            tokenDisabled
            error={error}
          />
        ) : (
          <Skeleton />
        )}
      </FormRow>
      <FormRow>
        <H3>Receive</H3>
        <BassetsGrid>
          {initialized && mAsset ? (
            Object.keys(bAssets)
              .sort()
              .map(address => <BassetOutput key={address} address={address} />)
          ) : (
            <Skeletons skeletonCount={4} height={180} />
          )}
        </BassetsGrid>
      </FormRow>
    </>
  );
};
