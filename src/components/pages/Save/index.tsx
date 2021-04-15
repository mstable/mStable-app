import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { PageAction, PageHeader } from '../PageHeader';
import { Save as SaveV2 } from './v2';
import { RewardStreamsProvider } from '../../../context/RewardStreamsProvider';
import {
  formatMassetName,
  useSelectedMassetName,
} from '../../../context/SelectedMassetNameProvider';
import { ViewportWidth } from '../../../theme';
import { SaveOverview } from './v2/SaveOverview';
import { InfoBox } from '../../core/InfoBox';
import { ToggleSave } from './ToggleSave';
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider';
import { SaveMigration } from './v1/SaveMigration';
import { OnboardingProvider } from './hooks';

const ButtonPanel = styled.div`
  display: flex;
  background: 1px solid ${({ theme }) => theme.color.accent};
  border: 1px solid ${({ theme }) => theme.color.accent};
  align-items: flex-start;
  justify-content: center;
  border-radius: 1rem;
  padding: 1rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 1rem;

  > * {
    width: 100%;
    margin-top: 1rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      margin-bottom: 1rem;
      margin-top: 0;
      width: 100%;
    }
  }
`;

const Content = styled.div`
  @media (min-width: ${ViewportWidth.l}) {
    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
    }
    > div:last-child {
      flex-basis: calc(35% - 0.5rem);
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    display: flex;
    flex-direction: column;

    @media (min-width: ${ViewportWidth.l}) {
      flex-direction: row;
      justify-content: space-between;
    }
  }
`;

export const Save: FC = () => {
  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();
  const formattedName = formatMassetName(massetName);
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const vault = massetState?.savingsContracts.v2.boostedSavingsVault;

  return massetState ? (
    <RewardStreamsProvider vault={vault}>
      <OnboardingProvider>
        <PageHeader
          action={PageAction.Save}
          subtitle={`Native interest on ${formatMassetName(massetName)}`}
        />
        <Container>
          <SaveOverview />
          <Content>
            {selectedSaveVersion === 1 ? <SaveMigration /> : <SaveV2 />}
            <Sidebar>
              {massetName === 'musd' && (
                <ButtonPanel>
                  {massetName === 'musd' ? <ToggleSave /> : <div />}
                </ButtonPanel>
              )}
              <InfoBox>
                <h4>
                  <span>Using mStable Save</span>
                </h4>
                <p>
                  By depositing to {`i${formattedName}`} you will begin earning
                  interest on your underlying {formattedName}. Deposits to the
                  Vault will earn interest in addition to MTA rewards.
                </p>
                <p>
                  Deposits from assets other than {formattedName} will first
                  mint {formattedName} before being deposited.
                </p>
              </InfoBox>
            </Sidebar>
          </Content>
        </Container>
      </OnboardingProvider>
    </RewardStreamsProvider>
  ) : (
    <Skeleton height={400} />
  );
};
