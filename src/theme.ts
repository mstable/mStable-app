import { DefaultTheme, CSSProp, css } from 'styled-components';

export enum Color {
  gold = 'rgb(255,179,52)',
  goldTransparent = 'rgb(255,179,52, 0.2)',
  green = 'rgb(82,204,147)',
  greenTransparent = 'rgba(82,204,147, 0.2)',
  coolMint = 'rgb(133,242,190)',
  blue = 'rgb(23,110,222)',
  blueTransparent = 'rgba(0,92,222,0.2)',
  orange = 'rgb(202,94,0)',
  red = 'rgb(202,0,27)',
  redTransparent = 'rgba(202,0,27,0.2)',
  redTransparenter = 'rgba(202,0,27,0.1)',
  white = 'rgb(255,255,255)',
  black = 'rgb(0,0,0)',
  whiteTransparent = 'rgba(255,255,255,0.2)',
  blackTransparent = 'rgba(0,0,0,0.2)',
  blackTransparenter = 'rgba(0,0,0,0.06)',
  offWhite = 'rgb(249,245,242)',
  offBlack = 'rgb(37,39,45)',
  greyTransparent = 'rgba(127, 127, 127, 0.5)',
}

export enum Size {
  xs,
  s,
  m,
  l,
  xl,
}

export enum Spacing {
  xxs = '2px',
  xs = '6px',
  s = '16px',
  m = '20px',
  l = '30px',
  xl = '60px',
}

export enum FontSize {
  xs = '11px',
  s = '13px',
  m = '15px',
  l = '18px',
  xl = '28px',
  insane = '64px',
}

export enum ViewportWidth {
  xs = '320px',
  s = '480px',
  m = '640px',
  l = '1000px',
  xl = '1400px',
}

export const forMinWidth = (width: string, _css: CSSProp): CSSProp =>
  `@media (min-width: ${width}) {
   ${_css}
}`;

// eslint-disable-next-line consistent-return
export const mapSizeToFontSize = (size: Size): string => {
  // eslint-disable-next-line default-case
  switch (size) {
    case Size.xs:
      return FontSize.xs;
    case Size.s:
      return FontSize.s;
    case Size.m:
      return FontSize.m;
    case Size.l:
      return FontSize.l;
    case Size.xl:
      return FontSize.xl;
  }
};

// eslint-disable-next-line consistent-return
export const mapSizeToIconSize = ({ size }: { size: Size }): string => {
  // eslint-disable-next-line default-case
  switch (size) {
    case Size.xs:
      return '12px';
    case Size.s:
      return '16px';
    case Size.m:
      return '24px';
    case Size.l:
      return '32px';
    case Size.xl:
      return '64px';
  }
};

// eslint-disable-next-line consistent-return
export const mapSizeToSpacing = (size: Size): string => {
  // eslint-disable-next-line default-case
  switch (size) {
    case Size.xs:
      return Spacing.xs;
    case Size.s:
      return Spacing.s;
    case Size.m:
      return Spacing.m;
    case Size.l:
      return Spacing.l;
    case Size.xl:
      return Spacing.xl;
  }
};

export const mixins = {
  roundedBorder: css<{ inverted?: boolean }>`
    border: 1px
      ${({ inverted, theme }) =>
        inverted ? theme.color.whiteTransparent : theme.color.blackTransparent}
      solid;
    border-radius: 3px;
  `,
  borderTop: css<{ inverted?: boolean }>`
    border-top: 1px
      ${({ theme, inverted }) =>
        inverted ? theme.color.whiteTransparent : theme.color.blackTransparent}
      solid;
  `,
  textAlign: css<{ center?: boolean; right?: boolean }>`
    text-align: ${({ center, right }) =>
      center ? 'center' : right ? 'right' : 'initial'};
  `,
  numeric: css`
    font-family: 'DM Mono', monospace !important;
  `,
};

export const theme: DefaultTheme = {
  color: Color,
  spacing: Spacing,
  size: Size,
  fontSize: FontSize,
  viewportWidth: ViewportWidth,
  mixins,
};
