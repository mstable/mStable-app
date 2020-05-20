import React, { ComponentProps, FC, useCallback } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers/utils';
import Skeleton from 'react-loading-skeleton';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { useMusdContract } from '../../../context/DataProvider/ContractsProvider';
import { Size } from '../../../theme';
import { Interfaces, SendTxManifest } from '../../../types';
import { formatExactAmount } from '../../../web3/amounts';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { AmountInput } from '../../forms/AmountInput';
import { ToggleInput } from '../../forms/ToggleInput';
import { Form, FormRow, SubmitButton } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { BassetsGrid } from '../../core/Bassets';
import { BassetInput } from './BassetInput';
import { Skeletons } from '../../core/Skeletons';
import { MusdStats } from '../../stats/MusdStats';
import { Mode } from './types';
import { useMintState } from './state';

const MintMode = styled.div`
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

/**
 * Mint form component
 *
 */
export const Mint: FC<{}> = () => {
  const [
    { error, mAsset, mode, bAssetInputs, mAssetData, valid },
    { setMassetAmount, toggleBassetEnabled, toggleMode },
  ] = useMintState();

  const isMulti = mode === Mode.Multi;
  const loading: boolean = mAssetData == null ? true : mAssetData?.loading;
  const bAssets = mAssetData?.bAssets;
  const mAssetAddress = mAssetData?.token.address || null;
  const totalSupply = mAssetData?.token.totalSupply || null;

  const { account } = useWallet();
  const sendTransaction = useSendTransaction();
  const mUsdContract = useMusdContract();

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (!error && mUsdContract && mAsset.amount.exact && account) {
        const enabled = bAssetInputs.filter(b => b.enabled);

        // Mint single for one asset
        if (enabled.length === 1) {
          const manifest: SendTxManifest<Interfaces.Masset, 'mint'> = {
            iface: mUsdContract,
            args: [enabled[0].address, mAsset.amount.exact.toString()],
            fn: 'mint',
          };
          sendTransaction(manifest);
          return;
        }

        // Mint multi for more than one asset
        const manifest: SendTxManifest<Interfaces.Masset, 'mintMulti'> = {
          iface: mUsdContract,
          args: enabled.reduce(
            ([_addresses, _amounts, _receipient], b) => [
              [..._addresses, b.address],
              [..._amounts, b.amount.exact as BigNumber],
              _receipient,
            ],
            [[] as string[], [] as BigNumber[], account],
          ),
          fn: 'mintMulti',
        };
        sendTransaction(manifest);
      }
    },
    [error, mUsdContract, mAsset, bAssetInputs, sendTransaction, account],
  );

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof AmountInput>['onChange']>
  >(
    (_, simpleAmount) => {
      setMassetAmount(simpleAmount);
    },
    [setMassetAmount],
  );

  const handleSetMax = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onSetMax']>
  >(() => {
    // TODO later: this should also prevent pushing past max-weights
    const max = bAssetInputs
      .map(input => ({
        input,
        data: bAssets?.find(b => b.address === input.address),
      }))
      .filter(
        ({ input, data }) =>
          input.enabled && !input.error && data?.token.balance,
      )
      .reduce(
        (_max: BigNumber, b) => _max.add(b.data?.token.balance as BigNumber),
        new BigNumber(0),
      );

    setMassetAmount(formatExactAmount(max, 18));
  }, [bAssetInputs, bAssets, setMassetAmount]);

  return (
    <Form onSubmit={handleSubmit}>
      <MusdStats totalSupply={totalSupply} />
      <FormRow>
        <Header>
          <H3>Send</H3>
          <MintMode>
            <ToggleInput onClick={toggleMode} checked={mode === Mode.Multi} />
            <span>Mint with all stablecoins</span>
          </MintMode>
        </Header>
        <BassetsGrid>
          {loading ? (
            <Skeletons skeletonCount={4} height={180} />
          ) : (
            bAssetInputs.map(bAssetInput => (
              <BassetInput
                input={bAssetInput}
                handleToggle={toggleBassetEnabled}
                key={bAssetInput.address}
                mAssetAddress={mAssetAddress}
                toggleDisabled={isMulti || bAssetInput.enabled}
              />
            ))
          )}
        </BassetsGrid>
      </FormRow>
      <FormRow>
        <H3>Receive</H3>
        {mAssetAddress ? (
          <TokenAmountInput
            name="mUSD"
            amountValue={mAsset.formValue}
            tokenValue={mAssetAddress}
            onChangeAmount={handleChangeAmount}
            onChangeToken={() => {}}
            tokenAddresses={[mAssetAddress]}
            tokenDisabled
            onSetMax={handleSetMax}
            error={error || undefined}
          />
        ) : (
          <Skeleton />
        )}
      </FormRow>
      <div>
        <SubmitButton type="submit" size={Size.l} disabled={!valid}>
          Mint
        </SubmitButton>
      </div>
    </Form>
  );
};
