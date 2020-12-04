import React, { FC, useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import CountUp from 'react-countup';

import { useSelectedSaveV1Contract } from '../../../web3/hooks';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { TransactionForm } from '../../forms/TransactionForm';
import { Interfaces, SaveVersion } from '../../../types';
import { SaveProvider, useSaveState } from './SaveProvider';
import { SaveInput } from './SaveInput';
import { SaveInfo } from './SaveInfo';
import { SaveConfirm } from './SaveConfirm';
import { TransactionType } from './types';
import { PageHeader } from '../PageHeader';
import { ToggleSave, ToggleSaveSelection } from '../../forms/ToggleSave';
import { useAverageApyForPastWeek } from '../../../web3/hooks';

const { CURRENT, DEPRECATED } = SaveVersion;

const SaveMigration: FC = () => <p>migrate me!</p>;

const SaveForm: FC = () => {
  const {
    amount,
    amountInCredits,
    transactionType,
    valid,
    massetState,
  } = useSaveState();
  const massetSymbol = massetState?.token.symbol;

  const setFormManifest = useSetFormManifest();
  const savingsContract = useSelectedSaveV1Contract();

  // Set the form manifest
  useEffect(() => {
    if (valid && savingsContract && amount) {
      if (transactionType === TransactionType.Deposit) {
        const body = `${amount.format()} ${massetSymbol}`;
        setFormManifest<Interfaces.SavingsContract, 'depositSavings'>({
          iface: savingsContract,
          args: [amount.exact],
          fn: 'depositSavings',
          purpose: {
            present: `Depositing ${body}`,
            past: `Deposited ${body}`,
          },
        });
        return;
      }

      if (transactionType === TransactionType.Withdraw && amountInCredits) {
        const body = `${massetSymbol} savings`;
        setFormManifest<Interfaces.SavingsContract, 'redeem'>({
          iface: savingsContract,
          args: [amountInCredits.exact],
          fn: 'redeem',
          purpose: {
            present: `Withdrawing ${body}`,
            past: `Withdrew ${body}`,
          },
        });
        return;
      }
    }

    setFormManifest(null);
  }, [
    amountInCredits,
    valid,
    amount,
    savingsContract,
    setFormManifest,
    transactionType,
    massetSymbol,
  ]);

  return (
    <TransactionForm
      confirm={<SaveConfirm />}
      confirmLabel={
        transactionType === TransactionType.Deposit ? 'Deposit' : 'Withdraw'
      }
      input={<SaveInput />}
      transactionsLabel="Save transactions"
      valid={valid}
    />
  );
};

const APYStats = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    margin: 0;
    text-align: right;
    justify-content: flex-end;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
`;

const InfoCountUp = styled(CountUp)`
  font-size: 1.5rem;
  font-family: 'DM Mono', monospace;
  color: ${({ theme }) => theme.color.blue};
`;

const InfoMsg = styled.div`
  padding-top: 4px;
  font-size: 12px;
  max-width: 25ch;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    max-width: 20ch;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    max-width: inherit;
  }

  a {
    color: ${({ theme }) => theme.color.greyTransparent};
    border: none;
    text-decoration: underline;
  }
`;

export const Save: FC = () => {
  const [activeVersion, setActiveVersion] = useState(CURRENT);
  const apyForPastWeek = useAverageApyForPastWeek();
  const versionNumber = activeVersion === CURRENT ? 2 : 1;

  const handleVersionToggle = useCallback(
    (selection: ToggleSaveSelection) =>
      setActiveVersion(selection === 'primary' ? CURRENT : DEPRECATED),
    [],
  );

  const handleMigrateClick = useCallback(async () => {
    // await transaction trigger for withdraw.
    // switch state and allow user to select deposit w/ new balance
    setActiveVersion(CURRENT);
  }, []);

  const isCurrent = activeVersion === CURRENT;

  return (
    <SaveProvider>
      <FormProvider formId="save">
        <PageHeader
          title={`Save V${versionNumber}`}
          subtitle="Earn interest on your deposited mUSD"
        >
          <ToggleContainer>
            <ToggleSave
              onClick={handleVersionToggle}
              selection={activeVersion === CURRENT ? 'primary' : 'secondary'}
            />
          </ToggleContainer>
          <APYStats>
            {apyForPastWeek ? (
              <>
                <InfoCountUp end={apyForPastWeek} suffix="%" decimals={2} />
                <InfoMsg>
                  {' '}
                  <a
                    href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Average daily APY over the last 7 days
                  </a>
                </InfoMsg>
              </>
            ) : (
              <Skeleton height={42} width={100} />
            )}
          </APYStats>
        </PageHeader>
        <SaveInfo version={activeVersion} onMigrateClick={handleMigrateClick} />
        {isCurrent ? <SaveForm /> : <SaveMigration />}
      </FormProvider>
    </SaveProvider>
  );
};
