import React, { FC, useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { formatExactAmount } from '../../../web3/amounts';
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
    redemption,
    error,
    bAssetOutputs,
    mAssetData,
    mode,
    applyFee,
  } = useRedeemState();
  const {
    setRedemptionAmount,
    setExactRedemptionAmount,
    toggleBassetEnabled,
    toggleMode,
  } = useRedeemDispatch();

  const { loading, token } = mAssetData || {};
  const mUsdBalance = token?.balance;
  const massetAddress = token?.address || null;
  const isProportional = mode === Mode.RedeemMasset;

  const musdBalanceItem = useMemo(
    () => [
      {
        label: 'Balance',
        value: formatExactAmount(
          token?.balance,
          token?.decimals,
          token?.symbol,
          true,
        ),
      },
    ],
    [token],
  );

  const handleSetMax = useCallback(() => {
    if (mUsdBalance) {
      setExactRedemptionAmount(mUsdBalance);
    }
  }, [mUsdBalance, setExactRedemptionAmount]);

  const handleSetAmount = useCallback(
    (_, amount) => {
      setRedemptionAmount(amount);
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
            <span>Redeem with all stablecoins</span>
          </RedeemMode>
        </Header>
        {loading || !token?.address ? (
          <Skeleton />
        ) : (
          <TokenAmountInput
            name="redemption"
            tokenValue={token.address}
            amountValue={redemption.formValue || null}
            tokenAddresses={[token.address]}
            onChangeAmount={handleSetAmount}
            onSetMax={handleSetMax}
            items={musdBalanceItem}
            tokenDisabled
            error={error}
          />
        )}
      </FormRow>
      <FormRow>
        <H3>Receive</H3>
        <BassetsGrid>
          {loading || !massetAddress ? (
            <Skeletons skeletonCount={4} height={180} />
          ) : (
            bAssetOutputs.map(({ address, enabled }) => (
              <BassetOutput
                applyFee={applyFee}
                feeRate={mAssetData?.feeRate}
                key={address}
                address={address}
                handleToggle={toggleBassetEnabled}
                toggleDisabled={isProportional || enabled}
              />
            ))
          )}
        </BassetsGrid>
      </FormRow>
    </>
  );
};
