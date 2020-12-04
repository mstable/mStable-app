import { css } from 'styled-components';
import { forMinWidth, ViewportWidth } from '../../theme';

export const centredLayout = css`
  display: flex;
  width: 100%;
  min-width: ${ViewportWidth.xs};

  ${forMinWidth(ViewportWidth.s, `max-width: 520px;`)}
  ${forMinWidth(ViewportWidth.m, `max-width: 800px`)}
  ${forMinWidth(ViewportWidth.xl, `max-width: 1100px`)}
`;

export const gradientBackground = css`
  background: linear-gradient(
    rgba(248, 248, 248, 1) 4rem,
    transparent 36rem,
    transparent
  );
  padding: 2rem 1rem;
  border-radius: 2rem;

  @media (min-width: ${ViewportWidth.s}) {
    padding: 2rem 2.5rem;
  }

  @media (min-width: ${ViewportWidth.xl}) {
    padding: 2.5rem 4rem;
  }
`;
