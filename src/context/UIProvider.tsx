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
import { TokenDetailsFragment } from '../graphql/generated';
import { useMassetToken } from '../web3/hooks';

interface State {
  selectedMasset: MassetNames;
  walletExpanded: boolean;
}

interface Dispatch {
  selectMasset(massetName: MassetNames): void;
  collapseWallet(): void;
  expandWallet(): void;
}

enum Actions {
  SelectMasset,
  CollapseWallet,
  ExpandWallet,
}

type Action =
  | { type: Actions.SelectMasset; payload: MassetNames }
  | { type: Actions.CollapseWallet }
  | { type: Actions.ExpandWallet };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SelectMasset:
      return { ...state, selectedMasset: action.payload };
    case Actions.CollapseWallet:
      return { ...state, walletExpanded: false };
    case Actions.ExpandWallet:
      return { ...state, walletExpanded: true };
    default:
      return state;
  }
};

const initialState: State = {
  selectedMasset: MassetNames.mUSD,
  walletExpanded: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>([initialState, {}] as any);

/**
 * Provider for global UI state and interactions.
 */
export const UIProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const collapseWallet = useCallback<Dispatch['collapseWallet']>(() => {
    dispatch({ type: Actions.CollapseWallet });
  }, [dispatch]);

  const expandWallet = useCallback<Dispatch['expandWallet']>(() => {
    dispatch({ type: Actions.ExpandWallet });
  }, [dispatch]);

  const selectMasset = useCallback<Dispatch['selectMasset']>(
    massetName => {
      dispatch({ type: Actions.SelectMasset, payload: massetName });
    },
    [dispatch],
  );

  return (
    <context.Provider
      value={useMemo(
        () => [state, { collapseWallet, expandWallet, selectMasset }],
        [state, collapseWallet, expandWallet, selectMasset],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useUIContext = (): [State, Dispatch] => useContext(context);

export const useUIState = (): State => useUIContext()[0];

export const useWalletExpanded = (): State['walletExpanded'] =>
  useUIState().walletExpanded;

export const useUIDispatch = (): Dispatch => useUIContext()[1];

export const useCollapseWallet = (): Dispatch['collapseWallet'] =>
  useUIDispatch().collapseWallet;

export const useExpandWallet = (): Dispatch['expandWallet'] =>
  useUIDispatch().expandWallet;

export const useSelectMasset = (): Dispatch['selectMasset'] =>
  useUIDispatch().selectMasset;

export const useSelectedMassetToken = (): TokenDetailsFragment | null => {
  const [{ selectedMasset }] = useUIContext();
  return useMassetToken(selectedMasset);
};
