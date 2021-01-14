import React, { createContext, FC, useContext, useState } from 'react';
import { useInterval } from 'react-use';

import { useIsIdle } from './UserProvider';
import { useProvider } from './OnboardProvider';

export type MaybeBlockNumber = number | undefined;

const ctx = createContext<MaybeBlockNumber>(undefined);

export const BlockProvider: FC<{}> = ({ children }) => {
  const [blockNumber, setBlockNumber] = useState<MaybeBlockNumber>();
  const provider = useProvider();
  const idle = useIsIdle();

  useInterval(() => {
    if (!idle) {
      // Only set the new block number when the user is active
      // getBlockNumber apparently returns a string
      provider?.getBlockNumber().then(latest => {
        setBlockNumber(
          latest ? parseInt((latest as unknown) as string, 10) : undefined,
        );
      });
    }
  }, 20000);

  return <ctx.Provider value={blockNumber}>{children}</ctx.Provider>;
};

export const useBlockNumber = (): MaybeBlockNumber => useContext(ctx);
