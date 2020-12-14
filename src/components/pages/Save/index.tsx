import React, { FC } from 'react';

import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider';
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';
import { PageHeader } from '../PageHeader';
import { SaveInfo } from './SaveInfo';
import { ToggleSave } from './ToggleSave';
import { WeeklySaveAPY } from './WeeklySaveAPY';
import { SaveV1 } from './v1';
import { SaveV2 } from './v2';

export const Save: FC = () => {
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const selectedMassetName = useSelectedMassetName();

  return (
    <>
      <PageHeader
        title="Save"
        subtitle={`Earn interest on your deposited ${selectedMassetName}`}
      >
        <ToggleSave />
        <WeeklySaveAPY />
      </PageHeader>
      <SaveInfo />
      {selectedSaveVersion === 1 ? <SaveV1 /> : <SaveV2 />}
    </>
  );
};
