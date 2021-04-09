import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';

import { SimpleMassetStats } from '../stats/SimpleMassetStats';
import { Overview, CardButton } from '../core/TransitionCard';

const MassetAsideContainer = styled.aside`
  padding: 0 1rem 1rem;
  border-radius: 0.75rem;
  flex-shrink: 1;
  height: auto;

  ${({ theme }) => `
    background: ${theme.color.backgroundAccent};
  `}

  > h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  > p {
    font-size: 0.875rem;
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const MassetAside: FC = () => {
  return (
    <MassetAsideContainer>
      <SimpleMassetStats />
    </MassetAsideContainer>
  );
};

const Separator = styled.div`
  height: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.accent};
  width: 100%;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
`;

const Inner = styled.div`
  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > * {
      width: 36rem;
    }
  }
`;

const MigrationOverlay = styled.div`
  * {
    cursor: not-allowed;
    pointer-events: none;
  }

  opacity: 0.75;
  background: ${({ theme }) => theme.color.background};
  z-index: 4;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const MassetPage: FC<{ asideVisible?: boolean }> = ({
  children,
  asideVisible,
}) => {
  const { undergoingRecol } = useSelectedMassetState() ?? {};
  const [selection, setSelection] = useState<string | undefined>();

  // enable collapse
  const handleSelection = useCallback(
    (newValue?: string) =>
      setSelection(selection === newValue ? undefined : newValue),
    [selection],
  );

  return (
    <Container>
      {undergoingRecol && <MigrationOverlay />}
      {asideVisible ? (
        <Inner>
          <div>{children}</div>
          <Separator />
          <Overview
            components={{ root: <MassetAside /> }}
            selection={selection}
          >
            <CardButton onClick={() => handleSelection('root')}>
              <h3>View Basket Stats</h3>
            </CardButton>
          </Overview>
        </Inner>
      ) : (
        <div>{children}</div>
      )}
    </Container>
  );
};
