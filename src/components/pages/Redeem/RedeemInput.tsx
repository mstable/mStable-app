import React, { FC, useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

import { formatExactAmount } from '../../../web3/amounts';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { Skeletons } from '../../core/Skeletons';
import { BassetsGrid } from '../../core/Bassets';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { useRedeemDispatch, useRedeemState } from './RedeemProvider';
import { BassetOutput } from './BassetOutput';

export const RedeemInput: FC<{}> = () => {
  const { redemption, error, bAssetOutputs, mAssetData } = useRedeemState();
  const { setRedemptionAmount, setExactRedemptionAmount } = useRedeemDispatch();

  const { loading, token } = mAssetData || {};
  const mUsdBalance = token?.balance;
  const massetAddress = token?.address || null;

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
        <H3>Send</H3>
        {loading || !token?.address ? (
          <Skeleton />
        ) : (
          <TokenAmountInput
            name="redemption"
            tokenValue={token.address}
            amountValue={redemption.formValue}
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
            bAssetOutputs.map(({ address }) => (
              <BassetOutput key={address} address={address} />
            ))
          )}
        </BassetsGrid>
      </FormRow>
    </>
  );
};
