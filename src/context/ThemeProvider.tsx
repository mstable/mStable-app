import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { VictoryThemeDefinition } from 'victory-core';

import { Color, theme, ViewportWidth } from '../theme';

const numericFont = `'DM Mono', monospace`;

const viewportFontSizeMap: Record<ViewportWidth, number> = {
  [ViewportWidth.xs]: 12,
  [ViewportWidth.s]: 12,
  [ViewportWidth.m]: 10,
  [ViewportWidth.l]: 10,
  [ViewportWidth.xl]: 6,
};

const getVictoryTheme = (viewport: ViewportWidth): VictoryThemeDefinition => {
  const fontSize = viewportFontSizeMap[viewport];

  const baseLabelStyles = {
    fontFamily: numericFont,
    fontSize,
    padding: 0,
    fill: Color.offBlack,
    stroke: 'none',
  };

  const centeredLabelStyles = {
    ...baseLabelStyles,
    textAnchor: 'middle' as 'middle',
  };

  return {
    area: {
      style: {
        data: {
          fill: Color.white,
        },
        labels: centeredLabelStyles,
      },
    },
    axis: {
      style: {
        axis: { stroke: Color.blackTransparenter, strokeWidth: 2 },
        grid: { stroke: Color.blackTransparenter, strokeWidth: 2 },
        ticks: {
          stroke: Color.blackTransparenter,
          strokeWidth: 2,
          size: 10,
        },
        tickLabels: baseLabelStyles,
      },
    },
    bar: {
      style: {
        data: {
          fill: Color.white,
          padding: 8,
          strokeWidth: 0,
        },
        labels: baseLabelStyles,
      },
    },
    line: {
      style: {
        data: {
          fill: 'none',
          stroke: Color.white,
          strokeWidth: 2,
        },
        labels: centeredLabelStyles,
      },
    },
    tooltip: {
      style: { ...centeredLabelStyles, padding: 5, pointerEvents: 'none' },
      flyoutStyle: {
        stroke: 'none',
        fill: 'none',
        pointerEvents: 'none',
      },
      cornerRadius: 0,
      pointerLength: 0,
    },
    voronoi: {
      style: {
        data: {
          fill: 'none',
          stroke: 'none',
          strokeWidth: 0,
        },
        labels: {
          ...baseLabelStyles,
          padding: 2,
          pointerEvents: 'none',
          textAnchor: 'end',
        },
        flyout: {
          padding: 2,
          stroke: 'none',
          fill: Color.white,
          pointerEvents: 'none',
        },
      },
    },
  };
};

const victoryThemeCtx = createContext<VictoryThemeDefinition>({});

export const ThemeProvider: FC<{}> = ({ children }) => {
  const [viewport, setViewport] = useState<ViewportWidth>(ViewportWidth.xs);
  const [victoryTheme, setVictoryTheme] = useState<VictoryThemeDefinition>({});

  const handleResize = useCallback((): void => {
    const viewportWidth = window.innerWidth;

    if (viewportWidth >= 1400) {
      setViewport(ViewportWidth.xl);
    } else if (viewportWidth >= 1000) {
      setViewport(ViewportWidth.l);
    } else if (viewportWidth >= 640) {
      setViewport(ViewportWidth.m);
    } else if (viewportWidth >= 480) {
      setViewport(ViewportWidth.s);
    } else {
      setViewport(ViewportWidth.xs);
    }
  }, [setViewport]);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useLayoutEffect(() => {
    setVictoryTheme(getVictoryTheme(viewport));
  }, [viewport]);

  return (
    <StyledComponentsThemeProvider theme={theme}>
      <victoryThemeCtx.Provider value={victoryTheme}>
        {children}
      </victoryThemeCtx.Provider>
    </StyledComponentsThemeProvider>
  );
};

export const useVictoryTheme = (): VictoryThemeDefinition =>
  useContext(victoryThemeCtx);
