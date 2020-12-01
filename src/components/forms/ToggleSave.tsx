import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { UnstyledButton } from '../core/Button';

export type ToggleSaveSelection = 'primary' | 'secondary';

interface Props {
  onClick: (selection: ToggleSaveSelection) => void;
  className?: string;
  disabled?: boolean;
  defaultSelection?: ToggleSaveSelection;
}

const Container = styled(UnstyledButton)`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0;
  border-radius: 1.5rem;
  background: #eee;
`;

const DefaultTitle = styled.span<{ enabled: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  display: inline-block;
  font-weight: 600;
  color: ${({ theme, enabled }) =>
    enabled ? theme.color.white : theme.color.offBlack};
  background: ${({ theme, enabled }) => enabled && theme.color.blue};
  font-size: 1rem;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.25)};
  transition: 0.15s linear all;

  &:hover {
    opacity: 1;
  }
`;

const PrimaryTitle = styled(DefaultTitle)``;

const SecondaryTitle = styled(DefaultTitle)`
  margin-left: -0.5rem;
`;

export const ToggleSave: FC<Props> = props => {
  const { onClick, className, disabled, defaultSelection } = props;
  const [selected, setSelected] = useState(defaultSelection ?? 'primary');

  const isPrimary = selected === 'primary';
  const isSecondary = selected === 'secondary';

  const handleOnClick = (): void => {
    setSelected(isPrimary ? 'secondary' : 'primary');
    onClick(isPrimary ? 'secondary' : 'primary');
  };

  return (
    <Container
      onClick={handleOnClick}
      type="button"
      disabled={disabled}
      className={className}
    >
      <PrimaryTitle enabled={isPrimary}>Current</PrimaryTitle>
      <SecondaryTitle enabled={isSecondary}>Deprecated</SecondaryTitle>
    </Container>
  );
};
