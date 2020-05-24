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
  Add,
  MarkAsRead,
  HideToast,
}

export enum NotificationType {
  Success,
  Error,
  Info,
}

export interface Notification {
  type: NotificationType;
  id?: string;
  title: string;
  body?: string | null;
  link?: {
    href: string;
    title: string;
  } | null;
  read?: boolean;
  hideToast?: boolean;
}

interface State {
  [id: string]: Notification;
}

type Action =
  | {
      type: Actions.Add;
      payload: { id: string; notification: Notification };
    }
  | { type: Actions.MarkAsRead; payload: string }
  | { type: Actions.HideToast; payload: string };

type AddNotificationCallback = (
  title: Notification['title'],
  body?: Notification['body'],
  link?: Notification['link'],
) => void;

interface Dispatch {
  addErrorNotification: AddNotificationCallback;
  addInfoNotification: AddNotificationCallback;
  addSuccessNotification: AddNotificationCallback;
  markNotificationAsRead(id: string): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Add: {
      const { id, notification } = action.payload;
      return {
        ...state,
        [id]: { ...notification, id },
      };
    }

    case Actions.MarkAsRead: {
      const id = action.payload;
      const { [id]: notification } = state;
      return {
        ...state,
        [id]: { ...notification, read: true },
      };
    }

    case Actions.HideToast: {
      const id = action.payload;
      const { [id]: notification, ...notifications } = state;
      return {
        ...notifications,
        [id]: { ...notification, hideToast: true },
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

  const addNotification = useCallback(
    (notification: Notification) => {
      const id = Math.random().toString();

      dispatch({
        type: Actions.Add,
        payload: { id, notification },
      });

      // Hide the notification toast after a delay
      setTimeout(() => {
        dispatch({ type: Actions.HideToast, payload: id });
      }, 8000);
    },
    [dispatch],
  );

  const addErrorNotification = useCallback<Dispatch['addErrorNotification']>(
    (title, body, link) => {
      addNotification({ title, body, link, type: NotificationType.Error });
    },
    [addNotification],
  );

  const addInfoNotification = useCallback<Dispatch['addInfoNotification']>(
    (title, body, link) => {
      addNotification({ title, body, link, type: NotificationType.Info });
    },
    [addNotification],
  );

  const addSuccessNotification = useCallback<
    Dispatch['addSuccessNotification']
  >(
    (title, body, link) => {
      addNotification({ title, body, link, type: NotificationType.Success });
    },
    [addNotification],
  );

  const markNotificationAsRead = useCallback<
    Dispatch['markNotificationAsRead']
  >(
    id => {
      dispatch({ type: Actions.MarkAsRead, payload: id });
    },
    [dispatch],
  );

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            addErrorNotification,
            addInfoNotification,
            addSuccessNotification,
            markNotificationAsRead,
          },
        ],
        [
          state,
          addErrorNotification,
          addInfoNotification,
          addSuccessNotification,
          markNotificationAsRead,
        ],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useNotificationsContext = (): [State, Dispatch] =>
  useContext(context);

export const useNotificationsState = (): State => useNotificationsContext()[0];

export const useNotification = (id: string): Notification =>
  useNotificationsState()[id];

export const useUnreadNotificationsCount = (): number => {
  const notifications = useNotificationsState();
  return useMemo(
    () =>
      Object.keys(notifications)
        .map(id => notifications[id])
        .filter(n => !n.read).length,
    [notifications],
  );
};

export const useNotificationsDispatch = (): Dispatch =>
  useNotificationsContext()[1];

export const useAddErrorNotification = (): Dispatch['addErrorNotification'] =>
  useNotificationsDispatch().addErrorNotification;

export const useAddInfoNotification = (): Dispatch['addInfoNotification'] =>
  useNotificationsDispatch().addInfoNotification;

export const useAddSuccessNotification = (): Dispatch['addSuccessNotification'] =>
  useNotificationsDispatch().addSuccessNotification;

export const useMarkNotificationAsRead = (): Dispatch['markNotificationAsRead'] =>
  useNotificationsDispatch().markNotificationAsRead;
