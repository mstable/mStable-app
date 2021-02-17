/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentProps, FC } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useThemeMode } from '../../context/AppProvider';
import { getColorTheme } from '../../theme';

export const ThemedSkeleton: FC<ComponentProps<typeof Skeleton>> = props => {
  const themeMode = useThemeMode();
  const theme = getColorTheme(themeMode);
  return (
    <SkeletonTheme color={theme.accent} highlightColor={theme.bodyTransparent}>
      <Skeleton {...props} />
    </SkeletonTheme>
  );
};
