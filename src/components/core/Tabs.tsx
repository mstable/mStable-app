import styled from 'styled-components';
import { UnstyledButton } from './Button';
import { Color, FontSize, ViewportWidth } from '../../theme';

export const TabsContainer = styled.div`
  padding: 16px 0;
  display: flex;
  justify-content: space-evenly;

  > :first-child {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  > :last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
`;

export const TabBtn = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  border: ${({ active, theme }) =>
    `1px ${
      active ? theme.color.blueTransparent : theme.color.lightGrey
    } solid`};
  background: ${({ active }) =>
    active ? Color.blueTransparent : 'transparent'};
  color: ${({ active }) => (active ? Color.blue : Color.grey)};
  padding: 0.75rem 0.5rem;
  font-weight: bold;
  font-size: 1.75rem;
  width: 100%;

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.m};
  }
`;
