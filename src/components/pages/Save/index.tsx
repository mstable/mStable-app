import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import CountUp from 'react-countup';

import { useAverageApyForPastWeek } from '../../../web3/hooks';
import { PageHeader } from '../PageHeader';

import { SaveProvider } from './v1/SaveProvider';
import { SaveForm } from './v1/SaveForm';
import { SaveInfo } from './SaveInfo';
import { ToggleSave } from './ToggleSave';
import { useSelectedSavingsContractState } from '../../../context/SelectedSaveVersionProvider';
import { FormProvider } from '../../forms/TransactionForm/FormProvider';

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
  const apyForPastWeek = useAverageApyForPastWeek();
  const savingsContractState = useSelectedSavingsContractState();
  const isV1SelectedAndDeprecated =
    savingsContractState?.version === 1 && !savingsContractState.current;

  return (
    <>
      <PageHeader title="Save" subtitle="Earn interest on your deposited mUSD">
        <ToggleSave />
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
      {!isV1SelectedAndDeprecated && (
        <FormProvider formId="save">
          <SaveForm />
        </FormProvider>
      )}
    </>
  );
};

export const Save: FC = () => (
  <SaveProvider>
    <SaveContent />
  </SaveProvider>
);
