import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { useSelectedMassetState } from './DataProvider/DataProvider';
import { SavingsContractState } from './DataProvider/types';
import { useSelectedMassetName } from './SelectedMassetNameProvider';
import { useWalletAddress } from './OnboardProvider';
import { useV1SavingsBalanceQuery } from '../graphql/protocol';
import { BannerMessage, useSetBannerMessage } from './AppProvider';

export enum SaveVersion {
  V1 = 1,
  V2 = 2,
}

type SelectedSaveVersionCtx = [
  SaveVersion | undefined,
  Dispatch<SetStateAction<SaveVersion | undefined>>,
];

const ctx = createContext<SelectedSaveVersionCtx>(null as never);

export const SelectedSaveVersionProvider: FC = ({ children }) => {
  const ctxValue = useState<SaveVersion | undefined>(undefined);
  const [selectedSaveVersion, setSelectedSaveVersion] = ctxValue;
  const setRef = useRef(false);

  const location = useLocation();

  const setBannerMessage = useSetBannerMessage();
  const walletAddress = useWalletAddress();

  const massetName = useSelectedMassetName();
  const massetState = useSelectedMassetState();
  const savingsContracts = massetState?.savingsContracts;
  const v1 = savingsContracts?.v1;
  const v2 = savingsContracts?.v2;
  const v1Exists = !!v1;
  const v2Exists = !!v2;
  const v2Current = v2?.current;
  const v1Address = v1?.address;

  // The V1 savings balance is queried separately from the main query
  // because we need to know if it is loading or genuinely doesn't exist
  const v1SavingsBalanceQuery = useV1SavingsBalanceQuery({
    variables: {
      id: v1Address as string,
      account: walletAddress ?? '',
      include: !!(v1Address && walletAddress),
    },
    skip: !v1Address,
    returnPartialData: false,
  });

  const v1Balance =
    v1SavingsBalanceQuery.data?.savingsContract?.creditBalances[0];
  const hasNoV1Balance = !v1Balance || v1Balance.amount === '0';

  const loading = !savingsContracts || v1SavingsBalanceQuery.loading;

  useEffect(() => {
    if (!loading && !selectedSaveVersion && !setRef.current) {
      // Select v2 if is current, and the user has no v1 balance
      setSelectedSaveVersion(
        v2Current && hasNoV1Balance ? SaveVersion.V2 : SaveVersion.V1,
      );
      setRef.current = true;
    }
  }, [
    loading,
    hasNoV1Balance,
    selectedSaveVersion,
    setSelectedSaveVersion,
    v2Current,
  ]);

  useEffect(() => {
    let message: BannerMessage | undefined;

    if (!loading && v1Exists) {
      message = {
        title: 'SAVE V2 is launching soon! ',
        emoji: '⚠️',
        visible: true,
      };

      if (!hasNoV1Balance) {
        message.subtitle =
          'This will require you to migrate your existing funds.';
      }

      if (v2Exists) {
        if (location.pathname !== '/save') {
          message.url = '/save';
        }
        if (v2Current) {
          message.title = 'SAVE V2 has launched!';
          message.emoji = '🚀';
          if (!hasNoV1Balance) {
            message.subtitle =
              'Migrate your funds now to keep earning interest.';
          }
        } else {
          message.subtitle = 'Safely deposit your savings early now.';
        }
      }
    }

    setBannerMessage(message);
  }, [
    loading,
    location,
    setBannerMessage,
    hasNoV1Balance,
    v1Exists,
    v2Current,
    v2Exists,
  ]);

  // Remount the provider when the massetName or wallet changes
  // so that the state can be cleanly reset
  return (
    <ctx.Provider value={ctxValue} key={massetName + walletAddress}>
      {children}
    </ctx.Provider>
  );
};

export const useSelectedSaveVersion = (): SelectedSaveVersionCtx =>
  useContext(ctx);

export const useSelectedSavingsContractState = ():
  | SavingsContractState
  | undefined => {
  const massetState = useSelectedMassetState();
  const [selectedSaveVersion] = useSelectedSaveVersion();
  return massetState?.savingsContracts?.[
    `v${selectedSaveVersion}` as 'v1' | 'v2'
  ];
};

export const useSelectedSaveBalance = ():
  | SavingsContractState['savingsBalance']
  | undefined => {
  const savingsContract = useSelectedSavingsContractState();
  return savingsContract?.savingsBalance;
};
