import React, { createContext, FC, useContext, useMemo, useState } from 'react';
import useIdle from 'react-use/lib/useIdle';

import { OnboardProvider, useWalletAddress } from './OnboardProvider';

interface State {
  address: string | undefined;
  masqueradedAccount: string | undefined;
  idle: boolean;
}

interface Dispatch {
  masquerade(account?: string): void;
}

const dispatchCtx = createContext<Dispatch>({} as never);
const stateCtx = createContext<State>({
  idle: false,
  address: undefined,
  masqueradedAccount: undefined,
});

export const useMasquerade = (): Dispatch['masquerade'] =>
  useContext(dispatchCtx).masquerade;

export const useUserState = (): State => useContext(stateCtx);

export const useIsIdle = (): State['idle'] => useUserState().idle;

export const useAccount = ():
  | State['masqueradedAccount']
  | State['address'] => {
  const { address, masqueradedAccount } = useUserState();
  return masqueradedAccount || address;
};

export const useOwnAccount = (): State['address'] => useUserState().address;

export const useIsMasquerading = (): boolean =>
  Boolean(useUserState().masqueradedAccount);

const AccountProvider: FC<{}> = ({ children }) => {
  const address = useWalletAddress();
  const idle = useIdle();
  const [masqueradedAccount, masquerade] = useState<
    State['masqueradedAccount']
  >();

  const state = useMemo<State>(
    () => ({
      address,
      idle,
      masqueradedAccount,
    }),
    [address, idle, masqueradedAccount],
  );

  return (
    <dispatchCtx.Provider value={useMemo(() => ({ masquerade }), [masquerade])}>
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const UserProvider: FC<{}> = ({ children }) => (
  <OnboardProvider>
    <AccountProvider>{children}</AccountProvider>
  </OnboardProvider>
);
