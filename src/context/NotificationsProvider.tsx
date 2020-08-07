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
  MarkAllAsRead,
  HideToast,
}

export enum NotificationType {
  Success,
  Error,
  Info,
  Update,
}

export interface Notification {
  type: NotificationType;
  id: string;
  title: string;
  body?: string | null;
  link?: {
    href: string;
    title: string;
  } | null;
  read?: boolean;
  hideToast?: boolean;
}

type State = Notification[];

type Action =
  | {
      type: Actions.Add;
      payload: Notification;
    }
  | { type: Actions.MarkAsRead; payload: string }
  | { type: Actions.MarkAllAsRead }
  | { type: Actions.HideToast; payload: string };

type AddNotificationCallback = (
  title: Notification['title'],
  body?: Notification['body'],
  link?: Notification['link'],
) => void;

interface Dispatch {
  addErrorNotification: AddNotificationCallback;
  addInfoNotification: AddNotificationCallback;
  addUpdateNotification: AddNotificationCallback;
  addSuccessNotification: AddNotificationCallback;
  markNotificationAsRead(id: string): void;
  markAllNotificationsAsRead(): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Add: {
      const notification = action.payload;
      const existing = state.some(n => n.id === notification.id);
      return existing ? state : [notification, ...state];
    }

    case Actions.MarkAsRead: {
      const id = action.payload;
      return state.map(n => (n.id === id ? { ...n, read: true } : n));
    }

    case Actions.HideToast: {
      const id = action.payload;
      return state.map(n => (n.id === id ? { ...n, hideToast: true } : n));
    }

    case Actions.MarkAllAsRead:
      return state.map(n => (n.read ? n : { ...n, read: true }));

    default:
      return state;
  }
};

const initialState: State = [];

const context = createContext<[State, Dispatch]>([initialState, {} as never]);

/**
 * Provider for notifications (presumably shown in the UI).
 */
export const NotificationsProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString();

      dispatch({
        type: Actions.Add,
        payload: { id, ...notification },
      });

      // Hide the notification toast after a delay
      // (exception: update notifications)
      if (notification.type !== NotificationType.Update) {
        setTimeout(() => {
          dispatch({ type: Actions.HideToast, payload: id });
        }, 8000);
      }
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

  const addUpdateNotification = useCallback<Dispatch['addUpdateNotification']>(
    (title, body) => {
      addNotification({ title, body, type: NotificationType.Update });
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

  const markAllNotificationsAsRead = useCallback<
    Dispatch['markAllNotificationsAsRead']
  >(() => {
    dispatch({ type: Actions.MarkAllAsRead });
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            addErrorNotification,
            addInfoNotification,
            addUpdateNotification,
            addSuccessNotification,
            markNotificationAsRead,
            markAllNotificationsAsRead,
          },
        ],
        [
          state,
          addErrorNotification,
          addInfoNotification,
          addUpdateNotification,
          addSuccessNotification,
          markNotificationAsRead,
          markAllNotificationsAsRead,
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

export const useUnreadNotifications = (): Notification[] =>
  useNotificationsState().filter(n => !n.read && n.title !== 'Connected');

export const useNotificationsDispatch = (): Dispatch =>
  useNotificationsContext()[1];

export const useAddErrorNotification = (): Dispatch['addErrorNotification'] =>
  useNotificationsDispatch().addErrorNotification;

export const useAddInfoNotification = (): Dispatch['addInfoNotification'] =>
  useNotificationsDispatch().addInfoNotification;

export const useAddSuccessNotification = (): Dispatch['addSuccessNotification'] =>
  useNotificationsDispatch().addSuccessNotification;

export const useAddUpdateNotification = (): Dispatch['addUpdateNotification'] =>
  useNotificationsDispatch().addUpdateNotification;

export const useMarkNotificationAsRead = (): Dispatch['markNotificationAsRead'] =>
  useNotificationsDispatch().markNotificationAsRead;

export const useMarkAllNotificationsAsRead = (): Dispatch['markAllNotificationsAsRead'] =>
  useNotificationsDispatch().markAllNotificationsAsRead;
