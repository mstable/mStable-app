import React, { createContext, FC, useContext, useRef } from 'react';
import { useWallet } from 'use-wallet';

import { useIsIdle } from '../UserProvider';

export type MaybeBlockNumber = number | undefined;

const ctx = createContext<MaybeBlockNumber>(undefined);

export const BlockProvider: FC<{}> = ({ children }) => {
  const blockNumber = useRef<MaybeBlockNumber>();
  const { getBlockNumber } = useWallet();
  const idle = useIsIdle();

  if (!idle) {
    // Only set the new block number when the user is active
    // `getBlockNumber` apparently returns a string
    const latest = getBlockNumber();
    blockNumber.current = latest
      ? parseInt((latest as unknown) as string, 10)
      : undefined;
  }

  return <ctx.Provider value={blockNumber.current}>{children}</ctx.Provider>;
};

export const useBlockNumber = (): MaybeBlockNumber => useContext(ctx);
