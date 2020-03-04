import React, {
  FC,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  Reducer,
} from 'react';
import { MassetNames } from '../types';

interface State {
  isWalletOpen: boolean;
  selectedMasset: MassetNames;
}

interface Dispatch {
  selectMasset: (massetName: MassetNames) => void;
  toggleWallet: () => void;
}

type Action = { type: 'TOGGLE_WALLET' } | { type: 'SELECT_MASSET', payload: MassetNames };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_WALLET':
      return { ...state, isWalletOpen: !state.isWalletOpen };
    case 'SELECT_MASSET':
      return { ...state, selectedMasset: action.payload };
    default:
      return state;
  }
};

const initialState: State = {
  selectedMasset: MassetNames.mUSD,
  isWalletOpen: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>(null as any);

/**
 * Provider for global UI state and interactions.
 */
export const UIProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleWallet = useCallback(() => {
    dispatch({ type: 'TOGGLE_WALLET' });
  }, [dispatch]);

  const selectMasset = useCallback((massetName: MassetNames) => {
    dispatch({ type: 'SELECT_MASSET', payload: massetName });
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(() => [state, { toggleWallet, selectMasset }], [
        state,
        toggleWallet,
        selectMasset,
      ])}
    >
      {children}
    </context.Provider>
  );
};

export const useUIContext = (): [State, Dispatch] => useContext(context);
