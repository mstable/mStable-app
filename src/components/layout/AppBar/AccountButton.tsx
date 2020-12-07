import styled from 'styled-components';
import { UnstyledButton } from '../../core/Button';
import { Color } from '../../../theme';

export const AccountButton = styled(UnstyledButton)<{ active: boolean }>`
  align-items: center;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  font-weight: bold;
  height: 2rem;
  justify-content: space-between;
  line-height: 100%;
  padding: 0.25rem 0.8rem;
  text-transform: uppercase;
  transition: all 0.3s ease;

  > * {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }

  background: ${({ active }) =>
    active ? Color.whiteTransparent : 'transparent'};

  &:hover {
    background: ${({ active }) =>
      active ? Color.whiteTransparent : Color.blackTransparent};
  }
`;
