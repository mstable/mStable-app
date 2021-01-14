import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../theme';
import { Button } from './Button';
import { ActivitySpinner } from './ActivitySpinner';

interface StepOption {
  key: string;
  buttonTitle?: string;
  pending: boolean;
  title: string;
  onClick(): void;
}

export interface StepProps {
  key: string;
  complete: boolean;
  options: StepOption[];
}

interface Props extends StepProps {
  active: boolean;
}

const Title = styled.span``;

const SubmitButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Option = styled.div<{ skipped?: boolean; disabled?: boolean }>`
  width: 100%;
  border-radius: 0.75rem;
  height: 4.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  font-weight: 600;
  transition: 0.25s linear all;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 0 1.75rem;
    height: 5rem;
  }

  cursor: ${({ skipped, disabled }) =>
    skipped || disabled ? 'not-allowed' : 'pointer'};
  filter: ${({ skipped }) => (skipped ? 'grayscale(1)' : 'none')};
`;

const Options = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
  }

  &:before {
    position: absolute;
    left: 0;
    top: calc(50% - 0.125rem);
    width: 100%;
    height: 0.25rem;
    background: ${({ theme }) => theme.color.bodyTransparenter};
    content: '';
    z-index: -1;
  }
`;

const Container = styled.div<{
  active: boolean;
  complete: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${Option} {
    border: ${({ theme, active, complete }) =>
      complete
        ? `4px solid ${theme.color.greenTransparent}`
        : active
        ? `4px solid ${theme.color.primaryTransparent}`
        : `none`};
    background: ${({ theme, active, complete }) =>
      complete || active ? theme.color.background : theme.color.lightGrey};
  }

  ${Title} {
    opacity: ${({ active, complete }) => (active || complete ? 1 : 0.5)};
  }

  ${Button} {
    display: ${({ active }) => !active && 'none'};
  }
`;

export const Step: FC<Props> = ({ active, complete, options }) => (
  <Container active={active} complete={complete}>
    <Options>
      {options.map(
        ({ key, buttonTitle = 'Submit', title, onClick, pending }) => (
          <Option key={key} disabled={!active}>
            <Title>{title}</Title>
            <SubmitButton
              highlighted={active}
              onClick={onClick}
              disabled={!active}
            >
              {pending ? <ActivitySpinner pending /> : buttonTitle}
            </SubmitButton>
          </Option>
        ),
      )}
    </Options>
  </Container>
);
