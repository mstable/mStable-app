import React, { FC, useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { humanizeList } from '../../../web3/strings';
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
  const bAssetsData = dataState?.bAssets;

  const enabledBassets = useMemo(
    () =>
      Object.values(bAssets)
        .filter(b => b.enabled && bAssetsData?.[b.address])
        .map(b => (bAssetsData as NonNullable<typeof bAssetsData>)[b.address]),
    [bAssets, bAssetsData],
  );

  const errorLabel = useMemo<string | undefined>(
    () =>
      error
        ? `Unable to redeem${
            enabledBassets.length > 0
              ? ` with ${
                  mode === Mode.RedeemMasset
                    ? 'all assets'
                    : humanizeList(enabledBassets.map(b => b.symbol))
                }`
              : ''
          }`
        : undefined,
    [error, enabledBassets, mode],
  );

  const items = useMemo(() => {
    const balance = {
      label: 'Balance',
      value: mAsset?.balance.format(2, true, 'mUSD'),
    };

    return feeAmount?.exact.gt(0) && valid
      ? [
          balance,
          {
            label: 'NOTE',
            value: `${
              mode === Mode.RedeemMasset ? 'Redemption' : 'Swap'
            } fee applies (see details below)`,
          },
        ]
      : [balance];
  }, [mAsset, mode, feeAmount, valid]);

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
          <H3>Send mUSD</H3>
          <RedeemMode>
            <ToggleInput
              onClick={toggleMode}
              checked={mode === Mode.RedeemMasset}
            />
            <span>Redeem with all assets</span>
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
            errorLabel={errorLabel}
            error={error}
          />
        ) : (
          <Skeleton />
        )}
      </FormRow>
      <FormRow>
        <H3>Receive assets</H3>
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
