import { css } from 'styled-components';

import { ViewportWidth } from '../../theme';

export const containerBackground = css`
  border: 4px solid ${({ theme }) => theme.color.accent};
  padding: 2rem 1rem;
  border-radius: 2rem;

  @media (min-width: ${ViewportWidth.s}) {
    padding: 2rem;
  }
`;
