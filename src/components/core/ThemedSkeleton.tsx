/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentProps, FC } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useThemeMode } from '../../context/AppProvider'
import { colorTheme } from '../../theme'

export const ThemedSkeleton: FC<ComponentProps<typeof Skeleton> & { className?: string }> = props => {
  const themeMode = useThemeMode()
  const theme = colorTheme(themeMode)
  const { className } = props
  return (
    <div className={className}>
      <SkeletonTheme color={theme.background[2]} highlightColor={theme.background[0]}>
        <Skeleton {...props} />
      </SkeletonTheme>
    </div>
  )
}
