import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider';
import { PageAction, PageHeader } from '../PageHeader';
import { WeeklySaveAPY } from './WeeklySaveAPY';
import { Save as SaveV1 } from './v1';
import { Save as SaveV2 } from './v2';
import { MassetPage } from '../MassetPage';
import { RewardStreamsProvider } from '../../../context/RewardStreamsProvider';

export const Save: FC = () => {
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const massetState = useSelectedMassetState();
  const vault = massetState?.savingsContracts.v2.boostedSavingsVault;

  return massetState ? (
    <RewardStreamsProvider vault={vault}>
      <PageHeader action={PageAction.Save}>
        <WeeklySaveAPY />
      </PageHeader>
      <MassetPage>
        {selectedSaveVersion === 1 ? <SaveV1 /> : <SaveV2 />}
      </MassetPage>
    </RewardStreamsProvider>
  ) : (
    <Skeleton height={400} />
  );
};
