import styled from 'styled-components';

export const Input = styled.input<{ error: string | void; disabled?: boolean }>`
  appearance: none;
  background: ${({ theme, error, disabled }) =>
    error
      ? theme.color.redTransparenter
      : disabled
      ? theme.color.blackTransparenter
      : theme.color.white};

  border: ${({ theme, error, disabled }) =>
    `1px ${
      error
        ? theme.color.redTransparent
        : disabled
        ? theme.color.blackTransparent
        : 'rgba(0, 0, 0, 0.5)'
    } solid`};

  color: ${({ error, theme, disabled }) =>
    error ? theme.color.red : disabled ? '#404040' : theme.color.black};

  border-radius: 3px;
  font-size: 16px;
  font-weight: bold;
  min-width: 0;
  width: 100%;
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
    background: ${({ theme }) => theme.color.blueTransparent};
  }

  ${({ theme }) => theme.mixins.numeric};
`;
