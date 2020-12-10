import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

export enum SaveVersion {
  V1 = 1,
  V2 = 2,
}

const { V1 } = SaveVersion;

// Fallback to V1.
export const DEFAULT_SAVE_VERSION = V1;
export const SAVE_VERSIONS: SaveVersion[] = [V1];

enum Actions {
  SetActiveVersion,
  SetVersions,
}

interface State {
  versions: SaveVersion[];
  activeVersion: SaveVersion | undefined;
}

interface Dispatch {
  setActiveVersion(version: SaveVersion): void;
  setVersions(versions: SaveVersion[]): void;
}

type Action =
  | { type: Actions.SetActiveVersion; payload: SaveVersion }
  | { type: Actions.SetVersions; payload: SaveVersion[] };

const initialState: State = {
  versions: SAVE_VERSIONS,
  activeVersion: undefined,
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetActiveVersion:
      return {
        ...state,
        activeVersion: action.payload,
      };
    case Actions.SetVersions:
      return {
        versions: action.payload,
        activeVersion: action.payload[0],
      };
    default:
      return state;
  }
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const ActiveSaveVersionProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setActiveVersion = useCallback<Dispatch['setActiveVersion']>(
    version => {
      dispatch({
        type: Actions.SetActiveVersion,
        payload: version,
      });
    },
    [dispatch],
  );

  const setVersions = useCallback<Dispatch['setVersions']>(
    versions => {
      dispatch({
        type: Actions.SetVersions,
        payload: versions,
      });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ setActiveVersion, setVersions }), [
          setActiveVersion,
          setVersions,
        ])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useActiveSaveVersionState = (): State => useContext(stateCtx);

export const useActiveSaveVersionDispatch = (): Dispatch =>
  useContext(dispatchCtx);

export const useSetActiveVersion = (): Dispatch['setActiveVersion'] =>
  useContext(dispatchCtx).setActiveVersion;

export const useSetSaveVersions = (): Dispatch['setVersions'] =>
  useContext(dispatchCtx).setVersions;

export const useActiveSaveVersion = (): number | undefined =>
  useContext(stateCtx).activeVersion;
