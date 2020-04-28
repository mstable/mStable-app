import styled from 'styled-components';
import { mapSizeToSpacing, Size } from '../../theme';

export const FlexRow = styled.div<{ size?: Size }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ size }) => mapSizeToSpacing(size || Size.s)};

  > * {
     margin-right: ${({ size }) => mapSizeToSpacing(size || Size.s)};
  }
  > :last-child {
    margin-right: 0;
  }
`;
