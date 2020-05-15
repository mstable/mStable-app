import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { Action, Actions, BassetOutput, Dispatch, Mode, State } from './types';
import { BassetData } from '../../../context/DataProvider/types';
import { parseAmount } from '../../../web3/amounts';
import { RATIO_SCALE, EXP_SCALE } from '../../../web3/constants';
import { Amount } from '../../../types';
import { useMusdData } from '../../../context/DataProvider/DataProvider';

const estimateRedemptionQuantities = (
  bassets: BassetData[],
  massetAmount: BigNumber,
): Amount[] => {
  const scaledVaults = bassets.map(b =>
    parseUnits(b.vaultBalance as string, b.token.decimals)
      .mul(b.ratio as string)
      .div(RATIO_SCALE),
  );

  const totalVault = scaledVaults.reduce(
    (_totalVault, vault) => _totalVault.add(vault),
    new BigNumber(0),
  );

  return scaledVaults.map((vault, index) => {
    const percentage = vault.mul(EXP_SCALE).div(totalVault);
    const scaledAmount = percentage.mul(massetAmount).div(EXP_SCALE);
    const exact = scaledAmount
      .mul(RATIO_SCALE)
      .div(bassets[index].ratio as string);
    return {
      exact,
      simple: parseFloat(formatUnits(exact, bassets[index].token.decimals)),
    };
  });
};

const updateBassetAmounts = (state: State): State => {
  if (!state.massetData?.basket) return state;

  const {
    bAssetOutputs,
    redemption,
    massetData: { bAssets: bassetsData },
  } = state;

  const redemptionAmounts = estimateRedemptionQuantities(
    bassetsData,
    redemption.amount.exact || new BigNumber(0),
  );

  return {
    ...state,
    bAssetOutputs: bAssetOutputs.map((b, index) => ({
      ...b,
      amount: redemptionAmounts[index],
    })),
  };
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.UpdateMassetData: {
      const massetData = action.payload;
      return {
        ...state,
        massetData,
        bassets:
          state.bAssetOutputs.length > 0
            ? state.bAssetOutputs
            : massetData.bAssets.map(b => ({
                address: b.address,
                amount: { exact: null, simple: null },
              })) || [],
      };
    }
    case Actions.SetRedemptionAmount: {
      const formValue = action.payload;
      return updateBassetAmounts({
        ...state,
        redemption: {
          formValue,
          amount: parseAmount(
            formValue,
            state.massetData?.token.decimals || 18,
          ),
        },
      });
    }
    case Actions.SetError: {
      const { error } = action.payload;
      return { ...state, error };
    }
    default:
      throw new Error('Unhandled action type');
  }
};

const initialState: State = {
  bAssetOutputs: [],
  error: null,
  massetData: null,
  mode: Mode.RedeemProportional,
  redemption: {
    formValue: null,
    amount: {
      simple: null,
      exact: null,
    },
  },
};

const context = createContext<[State, Dispatch]>([{} as State, {} as Dispatch]);

export const ExitProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { error, redemption } = state;

  const setRedemptionAmount = useCallback<Dispatch['setRedemptionAmount']>(
    amount => {
      dispatch({ type: Actions.SetRedemptionAmount, payload: amount });
    },
    [dispatch],
  );

  const setError = useCallback(
    (_error: string | null) => {
      dispatch({ type: Actions.SetError, payload: { error: _error } });
    },
    [dispatch],
  );

  const data = useMusdData();
  useEffect(() => {
    dispatch({
      type: Actions.UpdateMassetData,
      payload: data,
    });
  }, [dispatch, data]);

  const mUsdBalance = data?.token?.balance;
  useEffect(() => {
    if (redemption.amount.exact && mUsdBalance) {
      if (redemption.amount.exact.gt(mUsdBalance)) {
        setError('Insufficient balance');
        return;
      }
    }

    if (error) setError(null);
  }, [setError, error, redemption, mUsdBalance]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            setRedemptionAmount,
          },
        ],
        [state, setRedemptionAmount],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useExitContext = (): [State, Dispatch] => useContext(context);

export const useExitState = (): State => useExitContext()[0];

export const useExitBassetOutput = (address: string): BassetOutput | null => {
  const { bAssetOutputs } = useExitState();
  return useMemo(() => bAssetOutputs.find(b => b.address === address) || null, [
    address,
    bAssetOutputs,
  ]);
};

export const useExitBassetData = (address: string): BassetData | null => {
  const { massetData } = useExitState();
  return useMemo(
    () => massetData?.bAssets.find(b => b.address === address) || null,
    [massetData, address],
  );
};
