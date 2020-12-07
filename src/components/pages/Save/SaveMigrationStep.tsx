import React, { FC } from 'react';
import styled from 'styled-components';
import { SaveMigrationStep } from '../../../types';
import { ActivitySpinner } from '../../core/ActivitySpinner';
import { BubbleButton as Button } from '../../core/Button';

interface Props {
  pending?: boolean;
  active: boolean;
  complete: boolean;
  onClick: (step: SaveMigrationStep) => void;
  step: SaveMigrationStep;
}

const { WITHDRAW, APPROVE, DEPOSIT } = SaveMigrationStep;

const MIGRATION_TITLES = new Map<SaveMigrationStep, string>([
  [WITHDRAW, 'Withdraw'],
  [APPROVE, 'Approve'],
  [DEPOSIT, 'Deposit'],
]);

const Container = styled.div<{ active?: boolean; complete?: boolean }>`
  width: 100%;
  border-radius: 0.75rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: ${({ theme, active, complete }) =>
    complete
      ? `4px solid ${theme.color.greenTransparent}`
      : active
      ? `4px solid ${theme.color.blueTransparent}`
      : `none`};
  background: ${({ theme, active, complete }) =>
    complete || active ? theme.color.white : theme.color.lightGrey};
  padding: 0 1.75rem;
  font-weight: 600;
  transition: 0.25s linear background;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  span {
    opacity: ${({ active, complete }) => (active || complete ? 1 : 0.5)};
  }

  ${Button} {
    display: ${({ active }) => !active && `none`};
  }
`;

export const Step: FC<Props> = props => {
  const { active, pending, complete, step, onClick } = props;
  return (
    <Container active={active} complete={complete}>
      <span>{MIGRATION_TITLES.get(step)} </span>
      <Button highlighted={active || pending} onClick={() => onClick(step)}>
        {pending ? <ActivitySpinner success pending={pending} /> : `Submit`}
      </Button>
    </Container>
  );
};
