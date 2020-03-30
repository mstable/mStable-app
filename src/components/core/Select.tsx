import styled from 'styled-components';
import { FontSize } from '../../theme';

export const Select = styled.select`
  background: transparent;
  outline: 0;
  border: 2px ${props => props.theme.color.foreground} solid;
  color: ${props => props.theme.color.foreground};
  font-size: ${FontSize.l};
  font-weight: bold;
  height: 36px;
`;
