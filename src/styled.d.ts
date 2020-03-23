import 'styled-components';

import { Color, Spacing, Size, FontSize } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: typeof Color;
    spacing: typeof Spacing;
    size: typeof Size;
    fontSize: typeof FontSize;
  }
}
