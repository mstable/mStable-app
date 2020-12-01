import React, { FC } from 'react';
import styled from 'styled-components';
import { BubbleButton } from '../core/Button';

export type ToggleSaveSelection = 'primary' | 'secondary';

interface Props {
  onClick: (selection: ToggleSaveSelection) => void;
  className?: string;
  disabled?: boolean;
  selection?: ToggleSaveSelection;
}

const Container = styled.div`
  padding: 0;
  border-radius: 1.5rem;
  background: #eee;

  button:nth-last-child(1) {
    margin-left: -0.5rem;
  }
`;

export const ToggleSave: FC<Props> = props => {
  const { onClick, className, selection = 'primary' } = props;

  const isPrimary = selection === 'primary';

  return (
    <Container className={className}>
      <BubbleButton
        onClick={() => onClick('primary')}
        type="button"
        highlighted={isPrimary}
        scale={0.9}
      >
        Current
      </BubbleButton>
      <BubbleButton
        onClick={() => onClick('secondary')}
        type="button"
        highlighted={!isPrimary}
        scale={0.9}
      >
        Deprecated
      </BubbleButton>
    </Container>
  );
};
