import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { useSigner } from '../../../../context/OnboardProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { BoostedSavingsVaultFactory } from '../../../../typechain/BoostedSavingsVaultFactory';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';

import { AssetInput } from '../../../forms/AssetInput';
import { SendButton } from '../../../forms/SendButton';
import { MoreInfo } from '../../../core/Tabs';

const formId = 'VaultWithdraw';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const VaultWithdraw: FC = () => {
  const signer = useSigner();
  const propose = usePropose();

  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts.v2;
  const vault = savingsContract?.boostedSavingsVault;
  const vaultAddress = vault?.address;
  const account = vault?.account;
  const rawBalance = account?.rawBalance;

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput();

  const error = useMemo<string | undefined>(() => {
    if (inputAmount && rawBalance && rawBalance.exact.lt(inputAmount.exact)) {
      return 'Insufficient stake balance';
    }

    return undefined;
  }, [rawBalance, inputAmount]);

  const addressOptions = useMemo(
    () => [
      {
        address: vaultAddress as string,
        label: 'imUSD Vault',
        balance: rawBalance,
        symbol: 'imUSD',
      },
    ],
    [rawBalance, vaultAddress],
  );

  const valid = !!(inputAmount && inputAmount.simple > 0 && !error);

  return (
    <Container>
      <AssetInput
        address={vaultAddress}
        addressOptions={addressOptions}
        addressDisabled
        formValue={inputFormValue}
        handleSetAmount={setInputFormValue}
        handleSetMax={() => {
          if (rawBalance) {
            setInputFormValue(rawBalance.string);
          }
        }}
        error={error ? 'error' : undefined}
      />
      <SendButton
        valid={valid}
        title="Withdraw"
        handleSend={() => {
          if (vaultAddress && signer && inputAmount) {
            const body = `${inputAmount.format()} from the vault`;
            propose<Interfaces.BoostedSavingsVault, 'withdraw'>(
              new TransactionManifest(
                BoostedSavingsVaultFactory.connect(vaultAddress, signer),
                'withdraw',
                [inputAmount.exact],
                {
                  present: `Withdrawing ${body}`,
                  past: `Withdrawing ${body}`,
                },
                formId,
              ),
            );
          }
        }}
      />
      <MoreInfo>
        This transaction will claim any available MTA rewards.
      </MoreInfo>
    </Container>
  );
};
