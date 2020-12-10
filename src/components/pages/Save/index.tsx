import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import CountUp from 'react-countup';

import { useAverageApyForPastWeek } from '../../../web3/hooks';
import { FormProvider } from '../../forms/TransactionForm/FormProvider';
import { PageHeader } from '../PageHeader';
import {
  ActiveSaveVersionProvider,
  SaveVersion,
  useActiveSaveVersionState,
} from './ActiveSaveVersionProvider';
import { SaveProvider } from './v1/SaveProvider';
import { SaveInfo } from './SaveInfo';
import { SaveForm } from './v1/SaveForm';
import { ToggleSave } from './ToggleSave';
import { SaveMigrationProvider } from './saveMigration/SaveMigrationProvder';

const { V1, V2 } = SaveVersion;

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

    :hover {
      color: ${({ theme }) => theme.color.gold};
    }
  }
`;

const SaveContent: FC = () => {
  const { versions, activeVersion } = useActiveSaveVersionState();
  const apyForPastWeek = useAverageApyForPastWeek();

  const isV1Deprecated = versions.length > 1;
  const showForm =
    (isV1Deprecated && activeVersion === V2) ||
    (!isV1Deprecated && activeVersion === V1);

  return (
    <>
      <PageHeader title="Save" subtitle="Earn interest on your deposited mUSD">
        <ToggleContainer>
          <ToggleSave />
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
      <SaveInfo />
      {showForm && <SaveForm />}
    </>
  );
};

export const Save: FC = () => (
  <ActiveSaveVersionProvider>
    <SaveProvider>
      <SaveMigrationProvider>
        <FormProvider formId="save">
          <SaveContent />
        </FormProvider>
      </SaveMigrationProvider>
    </SaveProvider>
  </ActiveSaveVersionProvider>
);
