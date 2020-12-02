import React, {
  Reducer,
  useCallback,
  createContext,
  useReducer,
  FC,
  useMemo,
  useContext,
} from 'react';
import { useHistory } from 'react-router-dom';
import { MassetName, Masset } from '../types';
import { ReactComponent as MusdIcon } from '../components/icons/musd_logo.svg';
import { ReactComponent as BtcIcon } from '../components/icons/btc_logo.svg';

enum Actions {
  SelectMasset,
}

type Action = { type: Actions.SelectMasset; payload: MassetName };

interface Dispatch {
  selectMasset(massetName: MassetName): void;
}

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
    icon: <MusdIcon />,
  },
  {
    name: 'mBTC',
    address: process.env.REACT_APP_MBTC_ADDRESS as string,
    savingsContract: {
      address: process.env.REACT_APP_MBTC_SAVINGS_ADDRESS as string,
    },
    icon: <BtcIcon />,
  },
];

const retrievedMasset = localStorage.getItem('selectedMasset');

const initialState: State = {
  massets,
  selectedMasset: retrievedMasset ? JSON.parse(retrievedMasset) : massets[0],
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SelectMasset: {
      localStorage.setItem(
        'selectedMasset',
        JSON.stringify(massets.find(m => m.name === action.payload) as Masset),
      );
      return {
        ...state,
        selectedMasset: massets.find(m => m.name === action.payload) as Masset,
      };
    }

    default:
      return state;
  }
};

export const MassetsProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectMasset = useCallback<Dispatch['selectMasset']>(
    massetName => {
      dispatch({
        type: Actions.SelectMasset,
        payload: massetName,
      });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ selectMasset }), [selectMasset])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMassets = (): Masset[] => useContext(stateCtx).massets;

export const useMassetsDispatch = (): Dispatch => useContext(dispatchCtx);

export const useSelectedMasset = (): Masset =>
  useContext(stateCtx).selectedMasset;

export const useHandleMassetClick = (): ((name: MassetName) => void) => {
  const { selectMasset } = useMassetsDispatch();
  const history = useHistory();
  return useCallback(
    (name: MassetName) => {
      selectMasset(name);
      history.push(`/${name.toLowerCase()}/mint`);
    },
    [history, selectMasset],
  );
};
