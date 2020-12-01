import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { BubbleButton } from '../core/Button';

export type ToggleSaveSelection = 'primary' | 'secondary';

interface Props {
  onClick: (selection: ToggleSaveSelection) => void;
  className?: string;
  disabled?: boolean;
  defaultSelection?: ToggleSaveSelection;
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
  const { onClick, className, defaultSelection } = props;
  const [selected, setSelected] = useState(defaultSelection ?? 'primary');

  const isPrimary = selected === 'primary';

  const handleOnClick = (state: ToggleSaveSelection): void => {
    setSelected(state);
    onClick(state);
  };

  return (
    <Container className={className}>
      <BubbleButton
        onClick={() => handleOnClick('primary')}
        type="button"
        highlighted={isPrimary}
        scale={0.9}
      >
        Current
      </BubbleButton>
      <BubbleButton
        onClick={() => handleOnClick('secondary')}
        type="button"
        highlighted={!isPrimary}
        scale={0.9}
      >
        Deprecated
      </BubbleButton>
    </Container>
  );
};
