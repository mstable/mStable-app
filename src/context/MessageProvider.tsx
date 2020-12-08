import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

enum Actions {
  SetVisible,
  SetMessage,
}

interface Message {
  title: string;
  subtitle: string;
  emoji: string;
  url?: string;
}

interface State {
  message: Message;
  isVisible: boolean;
}

interface Dispatch {
  setVisible(isVisible: boolean): void;
  setMessage(message: Message): void;
}

type Action =
  | { type: Actions.SetVisible; payload: boolean }
  | { type: Actions.SetMessage; payload: Message };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetVisible:
      return {
        ...state,
        isVisible: action.payload,
      };
    case Actions.SetMessage:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};

const initialState: State = {
  message: {
    title: 'SAVE V2 has launched!',
    subtitle:
      'You’ll need to migrate your balance to continue earning interest.',
    emoji: '🎉',
    url: '#',
  },
  isVisible: false,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const MessageProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setVisible = useCallback<Dispatch['setVisible']>(
    isVisible => {
      dispatch({
        type: Actions.SetVisible,
        payload: isVisible,
      });
    },
    [dispatch],
  );

  const setMessage = useCallback<Dispatch['setMessage']>(
    message => {
      dispatch({
        type: Actions.SetMessage,
        payload: message,
      });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ setVisible, setMessage }), [
          setVisible,
          setMessage,
        ])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMessageState = (): State => useContext(stateCtx);

export const useMessageDispatch = (): Dispatch => useContext(dispatchCtx);
