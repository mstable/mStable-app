import React, { ComponentProps, FC } from 'react';
import Skeleton from 'react-loading-skeleton';

interface Props extends ComponentProps<typeof Skeleton> {
  skeletonCount: number;
}

export const Skeletons: FC<Props> = ({ skeletonCount, height, width }) => (
  <>
    {[...new Array(skeletonCount)].map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Skeleton key={index} height={height} width={width} />
    ))}
  </>
);
