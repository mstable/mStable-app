import React, { createContext, FC, useContext, useRef } from 'react';

import { useIsIdle } from '../UserProvider';
import { useProviderContext } from '../OnboardProvider';

export type MaybeBlockNumber = number | undefined;

const ctx = createContext<MaybeBlockNumber>(undefined);

export const BlockProvider: FC<{}> = ({ children }) => {
  const blockNumber = useRef<MaybeBlockNumber>();
  const provider = useProviderContext();
  const idle = useIsIdle();

  if (!idle) {
    // Only set the new block number when the user is active
    // `getBlockNumber` apparently returns a string
    const latest = provider?.getBlockNumber();
    blockNumber.current = latest
      ? parseInt((latest as unknown) as string, 10)
      : undefined;
  }

  return <ctx.Provider value={blockNumber.current}>{children}</ctx.Provider>;
};

export const useBlockNumber = (): MaybeBlockNumber => useContext(ctx);
