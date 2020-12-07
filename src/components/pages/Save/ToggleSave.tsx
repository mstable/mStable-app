import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { BubbleButton } from '../../core/Button';
import {
  CURRENT_SAVE_VERSION,
  SAVE_VERSIONS,
  useActiveSaveVersion,
} from './SaveProvider';
import { useV1SavingsBalance } from '../../../context/DataProvider/DataProvider';

interface Props {
  className?: string;
  disabled?: boolean;
}

const Container = styled.div`
  padding: 0;
  border-radius: 1.5rem;
  background: #eee;

  button:nth-last-child(1) {
    margin-left: -0.5rem;
  }
`;

export const ToggleSave: FC<Props> = ({ className }) => {
  const setSaveVersion = useRef(false);
  const [activeVersion, setActiveVersion] = useActiveSaveVersion();
  const v1Balance = useV1SavingsBalance();

  useEffect(() => {
    // Set the save version to v1 (once only) if there is a v1 balance
    if (!setSaveVersion.current && v1Balance?.balance) {
      if (v1Balance.balance.exact.gt(0)) {
        setActiveVersion(SAVE_VERSIONS[0]);
        setSaveVersion.current = true;
      }
    }
  }, [setActiveVersion, v1Balance]);

  return (
    <Container className={className}>
      <BubbleButton
        onClick={() => {
          setActiveVersion(CURRENT_SAVE_VERSION);
        }}
        type="button"
        highlighted={activeVersion.isCurrent}
        scale={0.9}
      >
        V2
      </BubbleButton>
      <BubbleButton
        onClick={() => {
          setActiveVersion(SAVE_VERSIONS[0]);
        }}
        type="button"
        highlighted={!activeVersion.isCurrent}
        scale={0.9}
      >
        V1 (Deprecated)
      </BubbleButton>
    </Container>
  );
};
