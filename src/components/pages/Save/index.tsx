import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider';
import { PageAction, PageHeader } from '../PageHeader';
import { WeeklySaveAPY } from './WeeklySaveAPY';
import { Save as SaveV1 } from './v1';
import { Save as SaveV2 } from './v2';
import { MassetPage } from '../MassetPage';

export const Save: FC = () => {
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const massetState = useSelectedMassetState();

  return massetState ? (
    <>
      <PageHeader action={PageAction.Save}>
        <WeeklySaveAPY />
      </PageHeader>
      <MassetPage>
        {selectedSaveVersion === 1 ? <SaveV1 /> : <SaveV2 />}
      </MassetPage>
    </>
  ) : (
    <Skeleton height={400} />
  );
};
