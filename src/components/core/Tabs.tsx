import styled from 'styled-components';
import { UnstyledButton } from './Button';
import { Color, FontSize, ViewportWidth } from '../../theme';

export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const TabBtn = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  border-bottom: 4px
    ${({ active, theme }) => (active ? theme.color.primary : 'transparent')}
    solid;
  background: transparent;
  color: ${({ active, theme }) => (active ? theme.color.primary : Color.grey)};
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  font-size: 16px;
  width: 100%;
  transition: border-bottom-color 0.2s ease;

  &:hover {
    border-bottom-color: ${({ active, theme }) =>
      active ? theme.color.primary : theme.color.primaryTransparent};
  }

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.m};
  }
`;
