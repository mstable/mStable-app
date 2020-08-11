import { css } from 'styled-components';
import { forMinWidth, ViewportWidth } from '../../theme';

export const centredLayout = css`
  display: flex;
  width: 100%;
  min-width: ${ViewportWidth.xs};
  //margin: 0 auto;

  ${forMinWidth(ViewportWidth.s, `max-width: 520px;`)}
  ${forMinWidth(ViewportWidth.m, `max-width: 800px`)}
  ${forMinWidth(ViewportWidth.xl, `max-width: 1100px`)}
`;
