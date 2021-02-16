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
import { ViewportWidth } from '../../../theme';

const PageHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;

  > :last-child {
    align-items: center;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;

    > :last-child {
      align-items: flex-end;
      height: 3.75rem;
    }
  }
`;

export const Save: FC = () => {
  const [selectedSaveVersion] = useSelectedSaveVersion();
  const massetState = useSelectedMassetState();
  const massetName = useSelectedMassetName();

  return massetState ? (
    <>
      <PageHeaderContainer>
        <PageHeader
          action={PageAction.Save}
          subtitle={`Earn interest on your deposited ${massetState.token.symbol}`}
        >
          {massetName === 'musd' ? <ToggleSave /> : <div />}
        </PageHeader>
        <WeeklySaveAPY />
      </PageHeaderContainer>
      {selectedSaveVersion === 1 ? <SaveV1 /> : <SaveV2 />}
    </>
  ) : (
    <Skeleton height={400} />
  );
};
