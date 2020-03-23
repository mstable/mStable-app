import { DefaultTheme } from 'styled-components';

export enum Color {
  background = '#f9f5f2',
  gold = '#ffb334',
  green = '#5bb189',
  blue = '#005cde',
  foreground = '#000000',
}

export enum Size {
  xs,
  s,
  m,
  l,
  xl,
}

export enum Spacing {
  xs = '6px',
  s = '10px',
  m = '16px',
  l = '20px',
  xl = '40px',
}

export enum FontSize {
  xs = '11px',
  s = '13px',
  m = '16px',
  l = '20px',
  xl = '32px',
}

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
};
