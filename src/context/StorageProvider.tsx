import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import localforage from 'localforage';
import { State as SaveState } from '../components/pages/Save/types';
import { State as SwapState } from '../components/pages/Swap/types';

enum Actions {
  Update,
  Restore,
  Clear,
}

interface Storage {
  save?: SaveState;
  swap?: SwapState;
}

interface State {
  storage: Storage;
  restored: boolean;
}

type Action<TKey extends keyof Storage> =
  | {
      type: Actions.Update;
      payload: { key: TKey; value: Storage[TKey] };
    }
  | { type: Actions.Restore; payload: Storage }
  | { type: Actions.Clear };

interface Dispatch {
  update<TKey extends keyof Storage>(key: TKey, value: Storage[TKey]): void;
  restore(): void;
  clear(): void;
}

const initialStorageState: State = Object.freeze({
  restored: false,
  storage: {},
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storageReducer: Reducer<State, Action<any>> = (state, action) => {
  switch (action.type) {
    case Actions.Restore:
      return { storage: action.payload, restored: true };
    case Actions.Clear:
      return { restored: true, storage: {} };
    default:
      throw new Error('Unhandled action');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>(null as any);

const store = localforage.createInstance({ name: 'mStable-app' });

const getStorageKey = async <TKey extends keyof Storage>(
  key: TKey,
): Promise<Storage[TKey]> => store.getItem(key);

const getAllStorage = async (): Promise<Storage> => {
  const keys = (await store.keys()) as (keyof Storage)[];

  const values = await Promise.all(keys.map(getStorageKey));

  return keys.reduce(
    (_storage, key, index) => ({ ..._storage, [key]: values[index] }),
    {},
  );
};

const updateStorageKey = async <TKey extends keyof Storage>(
  key: TKey,
  value: Storage[TKey],
): Promise<void> => {
  await store.setItem(key, value);
};

/**
 * Provider to store and retrieve selected data from localforage.
 */
export const StorageProvider: FC<{}> = ({ children }) => {
  /**
   * The purpose of the state here is purely to restore initial state;
   * i.e. it is not a store that components rely on (it justs sets their
   * initial state).
   */
  const [state, dispatch] = useReducer(storageReducer, initialStorageState);

  const restore = useCallback<Dispatch['restore']>(async () => {
    const storage = await getAllStorage();
    dispatch({ type: Actions.Restore, payload: storage });
  }, [dispatch]);

  const update = useCallback<Dispatch['update']>(async (key, value) => {
    await updateStorageKey(key, value);
  }, []);

  const clear = useCallback<Dispatch['clear']>(() => {
    dispatch({ type: Actions.Clear });
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(() => [state, { restore, update, clear }], [
        state,
        restore,
        update,
        clear,
      ])}
    >
      {children}
    </context.Provider>
  );
};

export const useStorageContext = (): [State, Dispatch] => useContext(context);

export const useStorageIsRestored = (): boolean =>
  useStorageContext()[0].restored;

export const useStorageKey = <TKey extends keyof Storage>(
  key: TKey,
): Storage[TKey] => useStorageContext()[0].storage[key];

export const useStorageDispatch = (): Dispatch => useStorageContext()[1];

export const useStorageRestore = (): Dispatch['restore'] =>
  useStorageDispatch().restore;

export const useStorageUpdate = (): Dispatch['update'] =>
  useStorageDispatch().update;

export const useStorageClear = (): Dispatch['clear'] =>
  useStorageDispatch().clear;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useStorageReducer = <
  TKey extends keyof Storage,
  TDispatch,
  TState extends Storage[TKey]
>(
  key: TKey,
  initialState: TState,
  reducer: Reducer<TState, TDispatch>,
  hydrator: (state: TState) => TState = state => state,
) => {
  const restored = useStorageIsRestored();
  const storage = useStorageKey(key);
  const update = useStorageUpdate();

  /**
   * Hydrate the initial state and the storage (if any) with the
   * given hydrator (e.g. to deserialize BigNumbers).
   */
  const rehydratedState = hydrator({
    ...initialState,
    ...storage,
  });

  /**
   * Wrap the given reducer such that the state is stored after each action.
   */
  const wrappedReducer: typeof reducer = (state, action) => {
    const newState = reducer(state, action);

    // The state must be restored before updates are stored, because
    // the values not-yet-retrieved from storage should not be replaced.
    if (restored) {
      // This assumes that the state is serializable.
      update(key, newState);
    }

    return newState;
  };

  return useReducer(wrappedReducer, rehydratedState);
};
