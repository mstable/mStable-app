import React, {
  FC,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  Reducer,
} from 'react';

enum Actions {
  AddNotification,
  RemoveNotification,
}

export enum NotificationType {
  Success,
  Error,
}

export interface Notification {
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: {
    href: string;
    title: string;
  } | null;
}

interface State {
  [id: string]: Notification;
}

type Action =
  | {
      type: Actions.AddNotification;
      payload: { id: string; notification: Notification };
    }
  | { type: Actions.RemoveNotification; payload: { id: string } };

interface Dispatch {
  addNotification(notification: Notification): void;
  removeNotification(id: string): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.AddNotification: {
      const { id, notification } = action.payload;
      return {
        ...state,
        [id]: notification,
      };
    }
    case Actions.RemoveNotification: {
      const { [action.payload.id]: _, ...notifications } = state;
      return {
        ...notifications,
      };
    }
    default:
      return state;
  }
};

const initialState: State = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>([initialState, {}] as any);

/**
 * Provider for notifications (presumably shown in the UI).
 */
export const NotificationsProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addNotification = useCallback<Dispatch['addNotification']>(
    notification => {
      const id = Math.random().toString();

      dispatch({
        type: Actions.AddNotification,
        payload: { id, notification },
      });

      // Remove the notification after a delay
      setTimeout(() => {
        dispatch({ type: Actions.RemoveNotification, payload: { id } });
      }, 5000);
    },
    [dispatch],
  );

  const removeNotification = useCallback<Dispatch['removeNotification']>(
    id => {
      dispatch({ type: Actions.RemoveNotification, payload: { id } });
    },
    [dispatch],
  );

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            addNotification,
            removeNotification,
          },
        ],
        [state, addNotification, removeNotification],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useNotificationsContext = (): [State, Dispatch] =>
  useContext(context);

export const useNotificationsState = (): State => useNotificationsContext()[0];

export const useNotificationsDispatch = (): Dispatch =>
  useNotificationsContext()[1];

export const useAddSuccessNotification = (): ((
  title: Notification['title'],
  body?: Notification['body'],
  link?: Notification['link'],
) => void) => {
  const { addNotification } = useNotificationsDispatch();
  return useCallback(
    (title, body, link) => {
      addNotification({ type: NotificationType.Success, body, title, link });
    },
    [addNotification],
  );
};

export const useAddErrorNotification = (): ((
  title: Notification['title'],
  body?: Notification['body'],
  link?: Notification['link'],
) => void) => {
  const { addNotification } = useNotificationsDispatch();
  return useCallback(
    (title, body, link) => {
      addNotification({ type: NotificationType.Error, body, title, link });
    },
    [addNotification],
  );
};

export const useRemoveNotification = (): Dispatch['removeNotification'] =>
  useNotificationsDispatch().removeNotification;
