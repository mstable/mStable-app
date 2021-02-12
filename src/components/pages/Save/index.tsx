import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider';
import { PageAction, PageHeader } from '../PageHeader';
import { ToggleSave } from './ToggleSave';
import { WeeklySaveAPY } from './WeeklySaveAPY';
import { Save as SaveV1 } from './v1';
import { Save as SaveV2 } from './v2';

export const Save: FC = () => {
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const massetState = useSelectedMassetState();

  return massetState ? (
    <>
      <PageHeader
        action={PageAction.Save}
        subtitle={`Earn interest on your deposited ${massetState.token.symbol}`}
      >
        <ToggleSave />
        <WeeklySaveAPY />
      </PageHeader>
      {selectedSaveVersion === 1 ? <SaveV1 /> : <SaveV2 />}
    </>
  ) : (
    <Skeleton height={400} />
  );
};
