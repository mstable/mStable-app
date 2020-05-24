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
import { pipe } from 'ts-pipe-compose';

import { BassetData } from '../../../context/DataProvider/types';
import { useMusdData } from '../../../context/DataProvider/DataProvider';
import { parseAmount, parseExactAmount } from '../../../web3/amounts';
import { RATIO_SCALE, EXP_SCALE } from '../../../web3/constants';
import { Amount } from '../../../types';
import { Action, Actions, BassetOutput, Dispatch, Mode, State } from './types';
import { applyValidation } from './validate';

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
  if (!state.mAssetData?.basket) return state;

  const {
    bAssetOutputs,
    redemption,
    mAssetData: { bAssets: bassetsData },
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

const update = (state: State): State =>
  pipe(state, updateBassetAmounts, applyValidation);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.UpdateMassetData: {
      const mAssetData = action.payload;
      return update({
        ...state,
        mAssetData,
        bAssetOutputs:
          state.bAssetOutputs.length > 0
            ? state.bAssetOutputs
            : mAssetData.bAssets.map(b => ({
                address: b.address,
                amount: { exact: null, simple: null },
              })) || [],
      });
    }

    case Actions.SetExactRedemptionAmount: {
      const decimals = state.mAssetData?.token.decimals || 18;
      const parsedAmount = parseExactAmount(
        action.payload.gt(1000) ? action.payload : new BigNumber(0),
        decimals,
      );

      return update({
        ...state,
        touched: true,
        redemption: {
          formValue: parsedAmount.simple
            ? parsedAmount.simple.toString()
            : null,
          amount: parsedAmount,
        },
      });
    }

    case Actions.SetRedemptionAmount: {
      const formValue = action.payload;
      return update({
        ...state,
        touched: true,
        redemption: {
          formValue,
          amount: parseAmount(
            formValue,
            state.mAssetData?.token.decimals || 18,
          ),
        },
      });
    }

    default:
      throw new Error('Unhandled action type');
  }
};

const initialState: State = {
  bAssetOutputs: [],
  valid: false,
  touched: false,
  mAssetData: null,
  mode: Mode.RedeemProportional,
  redemption: {
    formValue: null,
    amount: {
      simple: null,
      exact: null,
    },
  },
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const RedeemProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRedemptionAmount = useCallback<Dispatch['setRedemptionAmount']>(
    amount => {
      dispatch({
        type: Actions.SetRedemptionAmount,
        payload: amount,
      });
    },
    [dispatch],
  );
  const setExactRedemptionAmount = useCallback<
    Dispatch['setExactRedemptionAmount']
  >(
    amount => {
      dispatch({
        type: Actions.SetExactRedemptionAmount,
        payload: amount,
      });
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

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({ setRedemptionAmount, setExactRedemptionAmount }),
          [setRedemptionAmount, setExactRedemptionAmount],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useRedeemState = (): State => useContext(stateCtx);

export const useRedeemDispatch = (): Dispatch => useContext(dispatchCtx);

export const useRedeemBassetOutput = (address: string): BassetOutput | null => {
  const { bAssetOutputs } = useRedeemState();
  return useMemo(() => bAssetOutputs.find(b => b.address === address) || null, [
    address,
    bAssetOutputs,
  ]);
};

export const useRedeemBassetData = (address: string): BassetData | null => {
  const { mAssetData } = useRedeemState();
  return useMemo(
    () => mAssetData?.bAssets.find(b => b.address === address) || null,
    [mAssetData, address],
  );
};
