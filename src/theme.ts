import { DefaultTheme, css } from 'styled-components'

export enum Color {
  gold = 'rgb(255,179,52)',
  green = 'rgb(82,204,147)',
  greenTransparent = 'rgba(82,204,147, 0.2)',
  coolMint = 'rgb(133,242,190)',
  blue = 'rgb(23,110,222)',
  coolBlue = 'rgb(74,161,255)',
  coolBlueTransparent = 'rgb(74,161,255, 0.2)',
  blueTransparent = 'rgba(0,92,222,0.2)',
  orange = 'rgb(202,94,0)',
  red = 'rgb(202,0,27)',
  redTransparent = 'rgba(202,0,27,0.2)',
  redTransparenter = 'rgba(202,0,27,0.1)',
  white = 'rgb(255,255,255)',
  black = 'rgb(0,0,0)',
  whiteTransparent = 'rgba(255,255,255,0.7)',
  whiteTransparenter = 'rgba(255,255,255,0.1)',
  blackTransparent = 'rgba(0,0,0,0.35)',
  blackTransparenter = 'rgba(0,0,0,0.06)',
  offWhite = 'rgb(249,245,242)',
  offBlackAccent = 'rgb(63,67,77)',
  offBlack = 'rgb(37,39,45)',
  lightGrey = 'rgba(235, 235, 235, 1)',
  lighterGrey = 'rgba(248,248,248,1)',
  grey = 'rgba(146, 154, 162, 1)',
  greyTransparent = 'rgba(146, 154, 162, 0.5)',
}

const ColorNew: {
  spaceBlue: Record<string, string>
  white: Record<string, string>
} = {
  spaceBlue: {
    0: 'rgba(5, 20, 44, 1)',
    1: 'rgba(12, 27, 50, 1)',
    2: 'rgba(23, 36, 59, 1)',
    3: 'rgba(35, 48, 69, 1)',
    4: 'rgba(45, 58, 78, 1)',
  },
  white: {
    0: 'rgba(255, 255, 255, 1)',
    1: 'rgba(247, 247, 247, 1)',
    2: 'rgba(242, 242, 242, 1)',
    3: 'rgba(235, 235, 235, 1)',
    4: 'rgba(232, 232, 232, 1)',
  },
}

interface ColorTheme {
  primary: string
  primaryTransparent: string
  body: string
  bodyAccent: string
  bodyTransparent: string
  bodyTransparenter: string
  offYellow: string
  disabled: string
  background: string
  backgroundAccent: string
  disabledInput: string
  disabledButton: string
  defaultBorder: string
  defaultToggle: string
  onboardBackground: string
  onboardItemHover: string
}

export const colorTheme = (theme: 'light' | 'dark'): ColorTheme & typeof Color => {
  const isLight = theme === 'light'
  return {
    ...Color,
    disabled: isLight ? Color.blackTransparent : Color.whiteTransparent,
    offYellow: isLight ? 'rgba(102, 88, 72, 0.8)' : 'rgba(194, 174, 152, 1)',
    primary: isLight ? Color.blue : Color.coolBlue,
    primaryTransparent: isLight ? Color.blueTransparent : Color.coolBlueTransparent,
    body: isLight ? Color.offBlack : Color.white,
    bodyTransparent: isLight ? Color.blackTransparent : Color.whiteTransparent,
    bodyTransparenter: isLight ? Color.blackTransparenter : Color.whiteTransparenter,
    bodyAccent: isLight ? Color.grey : ColorNew.white[4],
    background: isLight ? ColorNew.white[0] : ColorNew.spaceBlue[0],
    backgroundAccent: isLight ? ColorNew.white[2] : ColorNew.spaceBlue[3],
    disabledInput: isLight ? ColorNew.white[2] : ColorNew.spaceBlue[3],
    disabledButton: isLight ? ColorNew.white[2] : ColorNew.spaceBlue[2],
    defaultBorder: isLight ? ColorNew.white[3] : ColorNew.spaceBlue[4],
    defaultToggle: isLight ? ColorNew.white[3] : ColorNew.spaceBlue[3],
    onboardBackground: isLight ? ColorNew.white[0] : ColorNew.spaceBlue[1],
    onboardItemHover: isLight ? ColorNew.white[1] : ColorNew.spaceBlue[2],
  }
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
  l = '910px',
}

// eslint-disable-next-line consistent-return
export const mapSizeToFontSize = (size: Size): string => {
  // eslint-disable-next-line default-case
  switch (size) {
    case Size.xs:
      return FontSize.xs
    case Size.s:
      return FontSize.s
    case Size.m:
      return FontSize.m
    case Size.l:
      return FontSize.l
    case Size.xl:
      return FontSize.xl
  }
}

// eslint-disable-next-line consistent-return
export const mapSizeToIconSize = ({ size }: { size: Size }): string => {
  // eslint-disable-next-line default-case
  switch (size) {
    case Size.xs:
      return '12px'
    case Size.s:
      return '16px'
    case Size.m:
      return '24px'
    case Size.l:
      return '32px'
    case Size.xl:
      return '64px'
  }
}

// eslint-disable-next-line consistent-return
export const mapSizeToSpacing = (size: Size): string => {
  // eslint-disable-next-line default-case
  switch (size) {
    case Size.xs:
      return Spacing.xs
    case Size.s:
      return Spacing.s
    case Size.m:
      return Spacing.m
    case Size.l:
      return Spacing.l
    case Size.xl:
      return Spacing.xl
  }
}

export const mixins = {
  roundedBorder: css<{ inverted?: boolean }>`
    border: 1px ${({ inverted, theme }) => (inverted ? theme.color.whiteTransparent : theme.color.blackTransparent)} solid;
    border-radius: 3px;
  `,
  textAlign: css<{ center?: boolean; right?: boolean }>`
    text-align: ${({ center, right }) => (center ? 'center' : right ? 'right' : 'initial')};
  `,
  numeric: css`
    font-family: 'DM Mono', monospace !important;
  `,
  card: css`
    display: flex;
    position: relative;
    flex-direction: column;
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    @media (min-width: ${ViewportWidth.m}) {
      padding: 1.5rem;
    }
  `,
}

export const lightTheme: DefaultTheme = {
  color: colorTheme('light'),
  spacing: Spacing,
  size: Size,
  fontSize: FontSize,
  viewportWidth: ViewportWidth,
  mixins,
  isLight: true,
}

export const darkTheme: DefaultTheme = {
  ...lightTheme,
  color: colorTheme('dark'),
  isLight: false,
}

export const gradientShift = css`
  position: relative;
  background: ${({ theme }) => theme.color.background};

  &:before {
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgb(255, 0, 0) 0%,
      rgb(255, 154, 0) 10%,
      rgb(208, 222, 33) 20%,
      rgb(79, 220, 74) 30%,
      rgb(63, 218, 216) 40%,
      rgb(47, 201, 226) 50%,
      rgb(28, 127, 238) 60%,
      rgb(95, 21, 242) 70%,
      rgb(186, 12, 248) 80%,
      rgb(251, 7, 217) 90%,
      rgb(255, 0, 0) 100%
    );
    filter: blur(0.15rem);
    inset: 1px;
    z-index: -1;
    border-radius: 0.75rem;
    animation: GradientShift 5s ease alternate infinite;
    background-size: 300% 300%;
  }

  @keyframes GradientShift {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`
