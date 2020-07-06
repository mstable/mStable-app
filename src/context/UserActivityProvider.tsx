import React, { FC, createContext, useMemo, useContext } from 'react';
import useIdle from 'react-use/lib/useIdle';

interface State {
  idle: boolean;
}

const ctx = createContext<State>({ idle: false });

export const UserActivityProvider: FC<{}> = ({ children }) => {
  const idle = useIdle();

  return (
    <ctx.Provider value={useMemo(() => ({ idle }), [idle])}>
      {children}
    </ctx.Provider>
  );
};

export const useUserActivityContext = (): State => useContext(ctx);
