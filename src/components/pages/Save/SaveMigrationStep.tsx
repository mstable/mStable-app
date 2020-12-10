import React, { FC } from 'react';
import styled from 'styled-components';
import { ViewportWidth } from '../../../theme';
import { ActivitySpinner } from '../../core/ActivitySpinner';
import { BubbleButton as Button } from '../../core/Button';
import { StepProps } from './saveMigration/types';

const Container = styled.div<{ active?: boolean; complete?: boolean }>`
  width: 100%;
  border-radius: 0.75rem;
  height: 4.5rem;
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
  padding: 0 0.5rem;
  font-weight: 600;
  transition: 0.25s linear background;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 0 1.75rem;
    height: 5rem;
  }

  span {
    opacity: ${({ active, complete }) => (active || complete ? 1 : 0.5)};
  }

  ${Button} {
    display: ${({ active }) => !active && `none`};
  }
`;

const SplitContainer = styled.div`
  display: flex;
  flex-direction: column;

  > ${Container}:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

    > ${Container}:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

export const Step: FC<StepProps> = props => {
  const {
    isCompleted,
    buttonTitle,
    title,
    isPending,
    isActive,
    onClick,
  } = props;
  const active = true;
  return (
    <SplitContainer>
      <Container active={isActive} complete={isCompleted} key={buttonTitle}>
        <span>{title} </span>
        <Button highlighted={active} onClick={onClick}>
          {isPending ? <ActivitySpinner success pending /> : buttonTitle}
        </Button>
      </Container>
    </SplitContainer>
  );
};
