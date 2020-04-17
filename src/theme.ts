import { DefaultTheme, CSSProp } from 'styled-components';

export enum Color {
  background = 'rgb(249, 245, 242)',
  backgroundTransparent = 'rgba(249, 245, 242, 0.3)',
  gold = '#ffb334',
  green = '#52cc93',
  blue = '#005cde',
  red = '#ca001b',
  redTransparent = 'rgba(202, 0, 27, 0.1)',
  white = '#fff',
  black = '#000',
  blackTransparent = 'rgba(0, 0, 0, 0.3)',
  foreground = '#000',
  foregroundTransparent = 'rgba(0, 0, 0, 0.3)',
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
  m = '16px',
  l = '20px',
  xl = '32px',
}

export enum ViewportWidth {
  xs = '320px',
  s = '480px',
  m = '640px',
  l = '900px',
  xl = '1400px',
}

export const forMinWidth = (width: ViewportWidth, css: CSSProp): CSSProp =>
  `@media (min-width: ${width}) {
   ${css}
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

export const theme: DefaultTheme = {
  color: Color,
  spacing: Spacing,
  size: Size,
  fontSize: FontSize,
  viewportWidth: ViewportWidth,
};
