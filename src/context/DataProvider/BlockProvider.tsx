import React, { createContext, FC, useContext, useRef, useEffect } from 'react';

import { useIsIdle } from '../UserProvider';
import { useProvider } from '../OnboardProvider';

export type MaybeBlockNumber = number | undefined;

const ctx = createContext<MaybeBlockNumber>(undefined);

export const BlockProvider: FC<{}> = ({ children }) => {
  const blockNumber = useRef<MaybeBlockNumber>();
  const provider = useProvider();
  const idle = useIsIdle();

  useEffect(() => {
    if (!idle) {
      // Only set the new block number when the user is active
      // getBlockNumber apparently returns a string
      provider?.getBlockNumber().then(latest => {
        blockNumber.current = latest
          ? parseInt((latest as unknown) as string, 10)
          : undefined;
      });
    }
  }, [idle, provider]);

  return <ctx.Provider value={blockNumber.current}>{children}</ctx.Provider>;
};

export const useBlockNumber = (): MaybeBlockNumber => useContext(ctx);
