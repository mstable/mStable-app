import { css } from 'styled-components';
import { forMinWidth, ViewportWidth } from '../../theme';

export const centredLayout = css<{ stretch?: boolean }>`
  display: flex;
  width: 100%;
  min-width: ${ViewportWidth.xs};
  margin: 0 auto;

  ${({ stretch }) =>
    stretch
      ? ''
      : `${forMinWidth(ViewportWidth.s, `max-width: ${ViewportWidth.s}`)}
  ${forMinWidth(ViewportWidth.m, `max-width: ${ViewportWidth.m}`)}
  ${forMinWidth(ViewportWidth.xl, `max-width: ${ViewportWidth.l}`)}`}
`;
