import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider';
import { PageAction, PageHeader } from '../PageHeader';
import { ToggleSave } from './ToggleSave';
import { WeeklySaveAPY } from './WeeklySaveAPY';
import { Save as SaveV1 } from './v1';
import { Save as SaveV2 } from './v2';
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';
import { MassetPage } from '../MassetPage';

const VersionToggle = styled(ToggleSave)`
  margin-bottom: 1rem;
`;

export const Save: FC = () => {
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();

  return massetState ? (
    <>
      <PageHeader action={PageAction.Save}>
        <WeeklySaveAPY />
      </PageHeader>
      <MassetPage>
        {massetName === 'musd' ? <VersionToggle /> : <div />}
        {selectedSaveVersion === 1 ? <SaveV1 /> : <SaveV2 />}
      </MassetPage>
    </>
  ) : (
    <Skeleton height={400} />
  );
};
