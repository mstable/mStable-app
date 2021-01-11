import styled from 'styled-components';
import { UnstyledButton } from './Button';
import { Color, FontSize, ViewportWidth } from '../../theme';

export const TabsContainer = styled.div`
  padding: 1rem 0;
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
  border: ${({ theme }) => `1px ${theme.color.blueTransparent} solid`};
  background: transparent;
  color: ${({ active }) => (active ? Color.blue : Color.grey)};
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  font-size: 1.75rem;
  width: 100%;

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.m};
  }
`;
