import React, { FC, useCallback, useMemo, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useWallet } from 'use-wallet';
import { Form, FormRow, SubmitButton } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { Skeletons } from '../../core/Skeletons';
import { BassetsGrid } from '../../core/Bassets';
import { Size } from '../../../theme';
import { BassetOutput } from './BassetOutput';
import { useExitContext } from './ExitProvider';
import { formatExactAmount } from '../../../web3/amounts';
import { Interfaces, SendTxManifest } from '../../../types';
import { MassetFactory } from '../../../typechain/MassetFactory';
import { useSignerContext } from '../../../context/SignerProvider';
import { useSendTransaction } from '../../../context/TransactionsProvider';

export const ExitForm: FC<{}> = () => {
  const [
    {
      redemption,
      error,
      bassets,
      massetData: { loading, data },
      massetBalance,
    },
    { setRedemptionAmount },
  ] = useExitContext();

  const massetAddress = data?.masset?.token.address;

  const signer = useSignerContext();
  const { account } = useWallet();
  const sendTransaction = useSendTransaction();

  const massetContract = useMemo(
    () =>
      signer && massetAddress
        ? MassetFactory.connect(massetAddress, signer)
        : null,
    [signer, massetAddress],
  );

  const touched = useRef<boolean>();

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (
        account &&
        massetContract &&
        redemption.amount.exact &&
        massetAddress
      ) {
        const manifest: SendTxManifest<Interfaces.Masset, 'redeemMasset'> = {
          iface: massetContract,
          args: [redemption.amount.exact, account],
          fn: 'redeemMasset',
        };
        sendTransaction(manifest);
      }
    },
    [redemption, massetAddress, massetContract, account, sendTransaction],
  );

  const handleSetMax = useCallback(() => {
    if (massetBalance) {
      setRedemptionAmount(formatExactAmount(massetBalance, 18));
    }
  }, [massetBalance, setRedemptionAmount]);

  const handleSetAmount = useCallback(
    (_, amount) => {
      if (!touched.current) {
        touched.current = true;
      }

      setRedemptionAmount(amount);
    },
    [setRedemptionAmount, touched],
  );

  const valid = useMemo<boolean>(
    () => !!(!error && redemption.amount.exact && touched.current),
    [touched, error, redemption],
  );

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <H3>Send</H3>
        {loading || !data?.masset ? (
          <Skeleton />
        ) : (
          <TokenAmountInput
            name="redemption"
            tokenValue={data.masset.token.address}
            amountValue={redemption.formValue}
            tokenAddresses={[data.masset.token.address]}
            onChangeAmount={handleSetAmount}
            onSetMax={handleSetMax}
            tokenDisabled
            error={error || undefined}
          />
        )}
      </FormRow>
      <FormRow>
        <H3>Receive</H3>
        <BassetsGrid>
          {loading || !massetAddress ? (
            <Skeletons skeletonCount={4} height={180} />
          ) : (
            bassets.map(({ address }) => (
              <BassetOutput key={address} address={address} />
            ))
          )}
        </BassetsGrid>
      </FormRow>
      <div>
        <SubmitButton size={Size.l} disabled={!valid}>
          Redeem
        </SubmitButton>
      </div>
    </Form>
  );
};
