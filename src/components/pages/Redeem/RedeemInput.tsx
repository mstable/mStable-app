import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled, { keyframes } from 'styled-components';

import { BigDecimal } from '../../../web3/BigDecimal';
import { FormRow } from '../../core/Form';
import { H3, H4, P } from '../../core/Typography';
import { Protip } from '../../core/Protip';
import { ExternalLink } from '../../core/ExternalLink';
import { BassetInputs } from '../../core/BassetInputs';
import { Amount, NumberFormat } from '../../core/Amount';
import { InlineTokenAmountInput } from '../../forms/InlineTokenAmountInput';
import { ToggleInput } from '../../forms/ToggleInput';
import { Color } from '../../../theme';
import { BasketStats } from '../../stats/BasketStats';
import { useRedeemDispatch, useRedeemState } from './RedeemProvider';
import { BassetOutput } from './BassetOutput';
import { Mode } from './types';

const RedeemMode = styled.div`
  display: flex;
  align-items: center;
  padding-left: 6px;
  padding-bottom: 16px;
  font-size: 12px;

  > * {
    margin-right: 8px;
  }
`;

const background = keyframes`
  from {
    background-color: transparent;
  }
  to {
    background-color: ${Color.goldTransparent};
  }
`;

const ProtipContainer = styled.div<{ highlight: boolean }>`
  margin-bottom: 16px;
  > * {
    animation: ${background} 1.5s ease infinite alternate-reverse;
    background-color: ${({ highlight }) =>
      highlight ? 'inherit' : 'transparent !important'};
  }
`;

const BasketImpact = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    flex: 1;
    max-width: 360px;

    > div {
      min-height: 60px;
      margin-bottom: 16px;
    }
  }
`;

const MassetInputGroup = styled.div`
  > * {
    margin-bottom: 8px;
  }
`;

export const RedeemInput: FC<{}> = () => {
  const {
    amountInMasset,
    bAssets,
    cappedSimulation,
    dataState,
    error,
    feeAmount,
    formValue,
    initialized,
    mode,
    touched,
    valid,
  } = useRedeemState();
  const {
    setMassetMaxAmount,
    setMassetAmount,
    toggleRedeemMasset,
  } = useRedeemDispatch();

  const mAsset = dataState?.mAsset;

  const considerUsingBalancer =
    (amountInMasset?.simple || 0) > 0 &&
    (amountInMasset as BigDecimal).simple < 3000;

  return (
    <>
      <ProtipContainer highlight={considerUsingBalancer}>
        <Protip>
          <P>
            Swap mUSD for many other assets on Balancer exchange{' '}
            <ExternalLink href="https://beta.balancer.exchange">
              here
            </ExternalLink>
            , which might be more cost efficient for small orders.
          </P>
        </Protip>
      </ProtipContainer>
      <FormRow>
        <H3>Send mUSD</H3>
        <RedeemMode>
          <ToggleInput
            onClick={toggleRedeemMasset}
            checked={mode === Mode.RedeemMasset}
          />
          <span>Redeem with all assets proportionally</span>
        </RedeemMode>
        {initialized && mAsset ? (
          <MassetInputGroup>
            <InlineTokenAmountInput
              amount={{
                value: amountInMasset,
                formValue: formValue || null,
                disabled: mode !== Mode.RedeemMasset,
                handleChange: setMassetAmount,
                handleSetMax:
                  mode === Mode.RedeemMasset ? setMassetMaxAmount : undefined,
              }}
              token={{
                address: mAsset.address,
                disabled: true,
              }}
              error={
                error?.affectedBassets.length === 0 ? error?.message : undefined
              }
              valid={touched ? valid : true}
            />
            {mode === Mode.RedeemMasset ? null : (
              <Protip title="Select assets below" emoji={null}>
                To redeem with specific assets, select the assets and amounts to
                receive below.
              </Protip>
            )}
            {feeAmount?.exact.gt(0) && valid ? (
              <Protip title="Note" emoji={null}>
                {mode === Mode.RedeemMasset ? 'Redemption' : 'Swap'} fee applies
                (see details below)
              </Protip>
            ) : null}
          </MassetInputGroup>
        ) : (
          <Skeleton />
        )}
      </FormRow>
      <FormRow>
        <H3>Receive assets</H3>
        <BassetInputs
          initialized={initialized}
          bAssets={bAssets}
          assetTooltip="Your mUSD will be exchanged for these assets"
          Input={BassetOutput}
        />
      </FormRow>
      <FormRow>
        <H3>Effects</H3>
        <P>See how this redemption affects mUSD and its basket of assets.</P>
        <div>
          <BasketImpact>
            <div>
              <div>
                <H4>Current basket</H4>
                <BasketStats />
              </div>
              <div>
                <H4>Current total supply</H4>
                <Amount
                  format={NumberFormat.Countup}
                  amount={dataState?.mAsset.totalSupply}
                />
              </div>
            </div>
            <div>
              {cappedSimulation ? (
                <>
                  <div>
                    <H4>New basket</H4>
                    <BasketStats simulation={cappedSimulation} />
                  </div>
                  <div>
                    <H4>New total supply</H4>
                    <Amount
                      format={NumberFormat.Countup}
                      amount={cappedSimulation.mAsset.totalSupply}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </BasketImpact>
        </div>
      </FormRow>
    </>
  );
};
