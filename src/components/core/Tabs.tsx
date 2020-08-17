import styled from 'styled-components';
import { Button } from './Button';
import { Color, FontSize } from '../../theme';

export const TabsContainer = styled.div`
  padding: 16px 0;
  display: flex;
  justify-content: space-evenly;
`;

export const TabBtn = styled(Button)<{ active: boolean }>`
  background: transparent;
  border-radius: 0;
  border: 0;
  border-top: 1px
    ${({ active }) => (active ? Color.blueTransparent : Color.blackTransparent)}
    solid;
  border-bottom: 4px ${({ active }) => (active ? Color.blue : 'transparent')}
    solid;
  color: ${({ active }) => (active ? Color.blue : Color.black)};
  font-size: ${FontSize.m};
  text-transform: uppercase;
  transition: all 0.2s ease;
  width: 100%;
`;
