import React, { FC } from 'react';
import styled from 'styled-components';
import { SaveMigrationStep } from '../../../types';
import { ActivitySpinner } from '../../core/ActivitySpinner';
import { BubbleButton as Button } from '../../core/Button';

interface Props {
  pendingIndex?: number;
  active: boolean;
  complete: boolean;
  onClick: (step: SaveMigrationStep, index: number) => void;
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

  span {
    opacity: ${({ active, complete }) => (active || complete ? 1 : 0.5)};
  }

  ${Button} {
    display: ${({ active }) => !active && `none`};
  }
`;

const SplitContainer = styled.div`
  display: flex;
  flex-direction: row;

  > ${Container}:not(:last-child) {
    margin-right: 0.5rem;
  }

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

export const Step: FC<Props> = props => {
  const { active, pendingIndex, complete, step, onClick } = props;

  const buttonTitles = step === APPROVE && active ? ['Exact', '∞'] : ['Submit'];

  return (
    <SplitContainer>
      {buttonTitles?.map((buttonTitle, i) => {
        const isPending = pendingIndex === i;
        return (
          <Container active={active} complete={complete}>
            <span>{MIGRATION_TITLES.get(step)} </span>
            <Button
              highlighted={active || pendingIndex !== undefined}
              onClick={() => onClick(step, i)}
            >
              {isPending ? <ActivitySpinner success pending /> : buttonTitle}
            </Button>
          </Container>
        );
      })}
    </SplitContainer>
  );
};
