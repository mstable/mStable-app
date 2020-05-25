import React, {
  ComponentProps,
  FC,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { BigNumber, parseUnits } from 'ethers/utils';
import Skeleton from 'react-loading-skeleton';
import { MaxUint256 } from 'ethers/constants';
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
import { RATIO_SCALE, SCALE } from '../../../web3/constants';

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

  const [firstLoad, setFirstLoad] = useState(true);

  const isMulti = mode === Mode.Multi;
  const loading: boolean = mAssetData == null ? true : mAssetData?.loading;
  const bAssets = mAssetData?.bAssets;
  const mAssetAddress = mAssetData?.token.address || null;
  const totalSupply = mAssetData?.token.totalSupply || null;

  const { account } = useWallet();
  const sendTransaction = useSendTransaction();
  const mUsdContract = useMusdContract();

  const mAssetBalanceItem = useMemo(
    () => [
      {
        label: 'Balance',
        value: formatExactAmount(
          mAssetData?.token?.balance,
          mAssetData?.token?.decimals,
          mAssetData?.token?.symbol,
          true,
        ),
      },
    ],
    [mAssetData],
  );

  useEffect(() => {
    if (firstLoad && !loading && bAssets && bAssets.length > 0) {
      // set bAsset to be input
      // toggleBassetEnabled(bAsset[0])
      const underweightBassets = bAssets.filter(
        b => !b.overweight && b.token && b.token.balance && b.ratio,
      );
      const ordered = underweightBassets.sort((a, b) => {
        if (!a.token || !a.token.balance || !a.ratio) {
          return 0;
        }
        if (!b.token || !b.token.balance || !b.ratio) {
          return 1;
        }
        return (
          b.token?.balance
            ?.mul(b.ratio as string)
            .div(RATIO_SCALE)
            .div(SCALE)
            .toNumber() -
          a.token?.balance
            ?.mul(a.ratio as string)
            .div(RATIO_SCALE)
            .div(SCALE)
            .toNumber()
        );
      });
      if (ordered.length > 0) {
        toggleBassetEnabled(ordered[0].address);
        setFirstLoad(false);
      }
    }
  }, [firstLoad, loading, bAssets, toggleBassetEnabled]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (!error && mUsdContract && mAsset.amount.exact && account) {
        const enabled = bAssetInputs.filter(b => b.enabled);

        // Mint single for one asset
        if (enabled.length === 1 && enabled[0].amount.exact) {
          const manifest: SendTxManifest<Interfaces.Masset, 'mint'> = {
            iface: mUsdContract,
            args: [enabled[0].address, enabled[0].amount.exact.toString()],
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
    // TODO later: this only works for proportional mintMulti
    const enabledBassets = bAssetInputs.filter(b => b.enabled);
    if (enabledBassets.length === 0 || !mAssetData?.token.totalSupply) {
      return setMassetAmount('0.00');
    }
    const isMintSingle = enabledBassets.length === 1;
    const input = enabledBassets[0];
    const data = bAssets?.find(b => b.address === input.address);
    if (
      isMintSingle &&
      data?.token?.balance &&
      data?.token?.decimals &&
      data?.ratio &&
      data?.vaultBalance &&
      data?.maxWeight
    ) {
      const ratioedInputBalance = data.token.balance
        .mul(data.ratio)
        .div(RATIO_SCALE);
      // Determining max possible mint without pushing bAsset over max weight uses below formula
      // M = ((t * maxW) - c)/(1-maxW)
      // num = ((t * maxW) - c)
      const num1 = parseUnits(
        mAssetData.token.totalSupply,
        mAssetData.token.decimals,
      )
        .mul(data.maxWeight)
        .div(SCALE);
      const num2 = parseUnits(data.vaultBalance, data.token.decimals)
        .mul(data.ratio)
        .div(RATIO_SCALE);
      const num = num1.sub(num2);
      // den = (1-maxW)
      const den = SCALE.sub(data.maxWeight);

      const maxMint = num.mul(SCALE).div(den);
      const clampedMax = maxMint.gt(ratioedInputBalance)
        ? ratioedInputBalance
        : maxMint;
      return setMassetAmount(formatExactAmount(clampedMax, 18));
    }
    if (!isMintSingle) {
      // max == min(ratioedBassetBalances)
      const ratioedBalances = enabledBassets
        .map(bAsset => ({
          ...bAsset,
          data: bAssets?.find(b => b.address === bAsset.address),
        }))
        .map(b => {
          if (b.data?.token.balance && b.data?.ratio) {
            return b.data?.token.balance.mul(b.data?.ratio).div(RATIO_SCALE);
          }
          return new BigNumber(0);
        });
      const minBalance = ratioedBalances.reduce(
        (p, b) => (b.lt(p) ? b : p),
        MaxUint256,
      );
      return setMassetAmount(
        formatExactAmount(minBalance.mul(enabledBassets.length), 18),
      );
    }
    return setMassetAmount('0.00');
  }, [bAssetInputs, mAssetData, bAssets, setMassetAmount]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
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
              items={mAssetBalanceItem}
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

      <MusdStats totalSupply={totalSupply} />
    </>
  );
};
