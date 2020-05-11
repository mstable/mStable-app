import React, {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers/utils';
import Skeleton from 'react-loading-skeleton';
import { useSignerContext } from '../../../context/SignerProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import {
  useKnownAddress,
  useMUSD,
} from '../../../context/KnownAddressProvider';
import { MassetFactory } from '../../../typechain/MassetFactory';
import { Erc20Factory } from '../../../typechain/Erc20Factory';
import { Size } from '../../../theme';
import { ContractNames, Interfaces, SendTxManifest } from '../../../types';
import { formatExactAmount } from '../../../web3/amounts';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { AmountInput } from '../../forms/AmountInput';
import { ToggleInput } from '../../forms/ToggleInput';
import { Form, FormRow, SubmitButton } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { BassetInput } from './BassetInput';
import { Skeletons } from '../../core/Skeletons';
import { Mode } from './types';
import { useMintState } from './state';

const BassetInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  gap: 8px 8px;
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.s};

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

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
    { initialized, error, masset, mode, bassets },
    {
      initialize,
      setError,
      // setBassetAmount,
      setBassetBalance,
      setMassetAmount,
      toggleBassetEnabled,
      toggleMode,
    },
  ] = useMintState();

  const isMulti = mode === Mode.Multi;

  const { account } = useWallet();

  const touched = useRef<boolean>(false);

  const signer = useSignerContext();

  const sendTransaction = useSendTransaction();

  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const musdQuery = useMUSD();
  const basket = musdQuery.data?.masset?.basket;
  const musdToken = musdQuery.data?.masset?.token;

  const mUSDContract = useMemo(
    () =>
      signer && mUSDAddress ? MassetFactory.connect(mUSDAddress, signer) : null,
    [signer, mUSDAddress],
  );

  const valid = useMemo(
    () =>
      touched.current &&
      masset.amount.exact &&
      !error &&
      bassets.filter(b => b.enabled).every(b => !b.error),
    [touched, error, bassets, masset],
  );

  // Set initial values
  useEffect(() => {
    if (initialized) return;

    if (musdToken && basket) {
      initialize(musdToken, basket);
    }
  }, [basket, musdToken, bassets, initialized, initialize]);

  // Run validation
  useEffect(() => {
    if (basket?.failed) {
      setError('Basket failed');
      return;
    }

    // TODO later (awaiting subgraph update) - block minting during recol

    if (touched.current && !bassets.some(b => b.enabled)) {
      setError('No assets selected');
      return;
    }

    setError(null);
  }, [touched, bassets, basket, setError]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (!error && mUSDContract && masset.amount.exact) {
        const enabled = bassets.filter(b => b.enabled);

        // Mint single for one asset
        if (enabled.length === 1) {
          const manifest: SendTxManifest<Interfaces.Masset, 'mint'> = {
            iface: mUSDContract,
            args: [enabled[0].address, masset.amount.exact.toString()],
            fn: 'mint',
          };
          sendTransaction(manifest);
        }

        // Mint multi for more than one asset
        const manifest: SendTxManifest<Interfaces.Masset, 'mintMulti'> = {
          iface: mUSDContract,
          args: enabled.reduce(
            ([_addresses, _amounts, _receipient], b) => [
              [..._addresses, b.address],
              [..._amounts, b.amount.exact as BigNumber],
              _receipient,
            ],
            [[] as string[], [] as BigNumber[], account as string],
          ),
          fn: 'mintMulti',
        };
        sendTransaction(manifest);
      }
    },
    [error, mUSDContract, masset, bassets, sendTransaction, account],
  );

  const handleChangeAmount = useCallback<
    NonNullable<ComponentProps<typeof AmountInput>['onChange']>
  >(
    (_, simpleAmount) => {
      if (!touched.current) touched.current = true;

      setMassetAmount(simpleAmount);
    },
    [setMassetAmount, touched],
  );

  const handleSetMax = useCallback<
    NonNullable<ComponentProps<typeof TokenAmountInput>['onSetMax']>
  >(() => {
    // TODO later: this should also prevent pushing past max-weights
    const max = bassets
      .filter(b => b.enabled && b.balance && !b.error)
      .reduce((_max, b) => _max.add(b.balance as BigNumber), new BigNumber(0));

    setMassetAmount(formatExactAmount(max, 18));
  }, [bassets, setMassetAmount]);

  const handleUnlock = useCallback(
    (address: string): void => {
      if (!signer) return;

      const tokenContract = Erc20Factory.connect(address, signer);

      tokenContract.totalSupply().then(totalSupply => {
        const manifest = {
          iface: tokenContract,
          fn: 'approve',
          args: [mUSDAddress, totalSupply],
        };
        sendTransaction(manifest);
      });
    },
    [sendTransaction, signer, mUSDAddress],
  );

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <Header>
          <H3>Send</H3>
          <MintMode>
            <ToggleInput onClick={toggleMode} checked={mode === Mode.Multi} />
            <span>Mint with all stablecoins</span>
          </MintMode>
        </Header>
        <BassetInputs>
          {musdQuery.loading ? (
            <Skeletons skeletonCount={4} height={180} />
          ) : (
            bassets.map(basset => (
              <BassetInput
                key={basset.address}
                massetAddress={mUSDAddress}
                handleUnlock={handleUnlock}
                handleToggle={toggleBassetEnabled}
                setBassetBalance={setBassetBalance}
                setError={setError}
                basset={basset}
                toggleDisabled={isMulti || basset.enabled}
              />
            ))
          )}
        </BassetInputs>
      </FormRow>
      <FormRow>
        <H3>Receive</H3>
        {mUSDAddress ? (
          <TokenAmountInput
            name="mUSD"
            amountValue={masset.formValue}
            tokenValue={mUSDAddress}
            onChangeAmount={handleChangeAmount}
            onChangeToken={() => {}}
            tokenAddresses={[mUSDAddress]}
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
