import { Reducer, useCallback } from 'react';
import createReducerContext from 'react-use/lib/createReducerContext';
import { MassetName, Masset } from '../types';

enum Actions {
  SelectMasset,
}

type Action = { type: Actions.SelectMasset; payload: MassetName };

interface State {
  selectedMasset: Masset;
  massets: Masset[];
}

const massets: Masset[] = [
  {
    name: 'mUSD',
    address: process.env.REACT_APP_MUSD_ADDRESS as string,
    savingsContract: {
      address: process.env.REACT_APP_MUSD_SAVINGS_ADDRESS as string,
    },
  },
  // TODO enable mBTC
  // {
  //   name: 'mBTC',
  //   address: process.env.REACT_APP_MBTC_ADDRESS as string,
  //   savingsContract: {
  //     address: process.env.REACT_APP_MBTC_SAVINGS_ADDRESS as string,
  //   },
  // },
];

const initialState: State = {
  selectedMasset: massets[0],
  massets,
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SelectMasset: {
      return {
        ...state,
        selectedMasset: massets.find(m => m.name === action.payload) as Masset,
      };
    }

    default:
      return state;
  }
};

const [useMassetsCtx, MassetsProvider] = createReducerContext(
  reducer,
  initialState,
);

export const useMassets = (): Masset[] => useMassetsCtx()[0].massets;

export const useSelectedMasset = (): Masset =>
  useMassetsCtx()[0].selectedMasset;

export const useSetSelectedMasset = (): ((name: MassetName) => void) => {
  const [, dispatch] = useMassetsCtx();
  return useCallback(
    (name: MassetName) => {
      dispatch({ type: Actions.SelectMasset, payload: name });
    },
    [dispatch],
  );
};

export { useMassetsCtx, MassetsProvider };
