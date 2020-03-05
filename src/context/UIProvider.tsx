import React, {
  FC,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  Reducer,
  useState,
  useEffect,
} from 'react';
import { useModal as useModalHook } from 'react-modal-hook';
import { MassetNames } from '../types';
import { WalletModal } from '../components/WalletModal';
import { TokenDetailsFragment } from '../graphql/generated';
import { useMassetToken } from '../web3/hooks';

interface State {
  selectedMasset: MassetNames;
  walletModalIsShown: boolean;
}

interface Dispatch {
  selectMasset(massetName: MassetNames): void;
  showWalletModal(): void;
  hideWalletModal(): void;
}

type Action = { type: 'SELECT_MASSET'; payload: MassetNames };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'SELECT_MASSET':
      return { ...state, selectedMasset: action.payload };
    default:
      return state;
  }
};

const initialState: State = {
  selectedMasset: MassetNames.mUSD,
  walletModalIsShown: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>([initialState, {}] as any);

const useModal = (): [() => void, () => void, boolean] => {
  let hideModal: () => void;
  const [isShown, setShown] = useState(false);
  const [_showModal, _hideModal] = useModalHook(() => (
    <WalletModal hideModal={hideModal} />
  ));

  const showModal = useCallback(() => {
    setShown(true);
  }, []);
  hideModal = useCallback(() => {
    setShown(false);
  }, []);

  useEffect(() => {
    if (isShown) {
      _showModal();
    } else {
      _hideModal();
    }
  }, [isShown, _showModal, _hideModal]);

  return [showModal, hideModal, isShown];
};

/**
 * Provider for global UI state and interactions.
 */
export const UIProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showWalletModal, hideWalletModal, walletModalIsShown] = useModal();

  const selectMasset = useCallback(
    (massetName: MassetNames) => {
      dispatch({ type: 'SELECT_MASSET', payload: massetName });
    },
    [dispatch],
  );

  return (
    <context.Provider
      value={useMemo(
        () => [
          { ...state, walletModalIsShown }, // FIXME use reducer
          { selectMasset, showWalletModal, hideWalletModal },
        ],
        [
          state,
          selectMasset,
          walletModalIsShown,
          showWalletModal,
          hideWalletModal,
        ],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useUIContext = (): [State, Dispatch] => useContext(context);

export const useSelectedMassetToken = (): TokenDetailsFragment | null => {
  const [{ selectedMasset }] = useUIContext();
  return useMassetToken(selectedMasset);
};
