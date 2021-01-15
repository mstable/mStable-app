import React, { FC } from 'react';

import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider';
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';
import { PageAction, PageHeader } from '../PageHeader';
import { ToggleSave } from './ToggleSave';
import { WeeklySaveAPY } from './WeeklySaveAPY';
import { Save as SaveV1 } from './v1';
import { Save as SaveV2 } from './v2';

export const Save: FC = () => {
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const selectedMassetName = useSelectedMassetName();

  return (
    <>
      <PageHeader
        action={PageAction.Save}
        subtitle={`Earn interest on your deposited ${selectedMassetName}`}
      >
        <ToggleSave />
        <WeeklySaveAPY />
      </PageHeader>
      {selectedSaveVersion === 1 ? <SaveV1 /> : <SaveV2 />}
    </>
  );
};
