import styled from 'styled-components';
import { UnstyledButton } from './Button';
import { Color, FontSize, ViewportWidth } from '../../theme';

export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const TabBtn = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  border-bottom: ${({ active, theme }) =>
    active ? `4px ${theme.color.blue} solid` : 'none'};
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
