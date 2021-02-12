import styled from 'styled-components';

import { CountUp } from './CountUp';
import { FontSize, ViewportWidth } from '../../theme';

export const StyledCountUp = styled(CountUp)`
  display: block;
  text-align: right;
`;

export const TokenContainer = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    padding-right: 8px;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    margin-right: 8px;
  }

  > :last-child {
    margin-right: 0;
  }

  input {
    margin-bottom: 0;
    height: 100%;
  }
`;

export const Error = styled.div`
  padding-top: 8px;
  font-size: ${FontSize.s};
  color: ${({ theme }) => theme.color.red};
`;

export const Label = styled.div`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: bold;
  text-transform: uppercase;

  @media (min-width: ${ViewportWidth.m}) {
    display: none;
  }
`;

export const BalanceContainer = styled.div``;

export const Grid = styled.div<{ enabled?: boolean }>`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0 8px;
  align-items: center;

  ${TokenContainer} {
    grid-area: 1 / 1 / 2 / 5;
  }

  ${InputContainer} {
    grid-area: 2 / 1 / 3 / 9;
    overflow: hidden;
    transition: all 0.4s ease;
    opacity: ${({ enabled }) => (enabled ? 1 : 0)};
    max-height: ${({ enabled }) => (enabled ? '100px' : 0)};
    padding-top: ${({ enabled }) => (enabled ? '8px' : 0)};
  }

  ${BalanceContainer} {
    grid-area: 1 / 5 / 2 / 9;
  }

  @media (min-width: ${ViewportWidth.l}) {
    ${TokenContainer} {
      grid-area: 1 / 1 / 3 / 3;
    }

    ${InputContainer} {
      grid-area: 1 / 3 / 3 / 7;
      opacity: 1;
      max-height: 100%;
      padding-top: 0;
    }

    ${BalanceContainer} {
      grid-area: 1 / 7 / 3 / 9;
    }
  }
`;

export const Container = styled.div<{
  valid?: boolean;
  overweight?: boolean;
  enabled?: boolean;
}>`
  border: 1px
    ${({ theme, valid }) =>
      valid ? theme.color.accent : theme.color.redTransparent}
    solid;
  border-radius: 3px;
  background: ${({ theme, overweight }) =>
    overweight && theme.color.blackTransparenter};
  padding: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 8px;
`;
