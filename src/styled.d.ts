import 'styled-components'

import { Color, ColorTheme, Spacing, Size, FontSize, ViewportWidth, mixins } from './theme'

declare module 'styled-components' {
  export interface DefaultTheme {
    color: ColorTheme &
      typeof Color & {
        // XXX issue combining these types...
        primary: string
        primaryTransparent: string
        body: string
        bodyAccent: string
        accent: string
        bodyTransparent: string
        bodyTransparenter: string
        background: string
        backgroundAccent: string
      }
    spacing: typeof Spacing
    size: typeof Size
    fontSize: typeof FontSize
    viewportWidth: typeof ViewportWidth
    mixins: typeof mixins
    isLight: typeof boolean
  }
}
