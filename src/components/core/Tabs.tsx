import styled from 'styled-components';
import { UnstyledButton } from './Button';
import { Color, FontSize, ViewportWidth } from '../../theme';

export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
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
  font-size: 1rem;
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

export const MoreInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  text-align: center;
  align-self: center;
`;

export const Message = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.color.backgroundAccent};
  padding: 1rem;
  margin: 1rem 2rem 0 2rem;
  border-radius: 0.5rem;

  span {
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`;
