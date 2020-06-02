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
import {
  formatSimpleAmount,
  parseAmount,
  parseExactAmount,
} from '../../../web3/amounts';
import { EXP_SCALE, RATIO_SCALE } from '../../../web3/constants';
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
    if (totalVault.eq(0)) {
      return {
        exact: null,
        simple: null,
      };
    }
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

const updateBAssetOutputs = (state: State): State => {
  if (!state.mAssetData?.basket) return state;

  const {
    bAssetOutputs,
    redemption,
    mAssetData: { bAssets },
    mode,
  } = state;

  if (mode === Mode.RedeemMasset) {
    const redemptionAmounts = estimateRedemptionQuantities(
      bAssets,
      redemption.amount.exact || new BigNumber(0),
    );

    return {
      ...state,
      bAssetOutputs: bAssetOutputs.map((b, index) => ({
        ...b,
        amount: redemptionAmounts[index],
        formValue:
          formatSimpleAmount(redemptionAmounts[index].simple || 0) || undefined,
      })),
    };
  }

  return {
    ...state,
    bAssetOutputs: bAssetOutputs.map(b => {
      const amount = redemption.amount.simple || 0;
      const bAssetData = bAssets.find(_b => _b.address === b.address);
      const decimals = bAssetData?.token.decimals;
      return {
        ...b,
        ...(b.enabled && decimals
          ? {
              // The redemption amount must be parsed for the bAsset decimals
              amount: parseAmount(amount.toString(), decimals),
              formValue:
                formatSimpleAmount(redemption.amount.simple || 0) || undefined,
            }
          : {
              amount: { exact: null, simple: null },
              formValue: undefined,
            }),
      };
    }),
  };
};

/**
 * Calculate and apply the swap fee.
 */
const applySwapFee = (state: State): State => {
  const {
    mAssetData,
    redemption: { amount },
  } = state;

  const nOverweightBassets =
    mAssetData?.bAssets.filter(b => b.overweight).length || 0;

  const feeAmountExact =
    amount.exact && mAssetData?.feeRate && nOverweightBassets === 0
      ? amount.exact.mul(mAssetData.feeRate).div(EXP_SCALE)
      : undefined;

  return {
    ...state,
    feeAmountSimple: feeAmountExact
      ? parseFloat(formatUnits(feeAmountExact, 18))
      : undefined,
  };
};

const update = (state: State): State =>
  pipe(state, updateBAssetOutputs, applyValidation, applySwapFee);

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
                enabled: true,
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
          formValue: parsedAmount.simple?.toString(),
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
          formValue: formValue || undefined,
          amount: parseAmount(
            formValue,
            state.mAssetData?.token.decimals || 18,
          ),
        },
      });
    }

    case Actions.ToggleBassetEnabled: {
      const address = action.payload;

      if (state.mode !== Mode.RedeemSingle) {
        return state;
      }

      return update({
        ...state,
        bAssetOutputs: state.bAssetOutputs.map(b => ({
          ...b,
          enabled: b.address === address,
        })),
      });
    }

    case Actions.ToggleMode: {
      // TODO redeemMulti
      const mode =
        state.mode === Mode.RedeemSingle
          ? Mode.RedeemMasset
          : Mode.RedeemSingle;
      return update({
        ...state,
        mode,
        bAssetOutputs: state.bAssetOutputs.map(b =>
          mode === Mode.RedeemSingle
            ? { ...b, enabled: false }
            : {
                ...b,
                enabled: true,
              },
        ),
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
  mode: Mode.RedeemMasset,
  redemption: {
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

  const toggleMode = useCallback<Dispatch['toggleMode']>(() => {
    dispatch({ type: Actions.ToggleMode });
  }, [dispatch]);

  const toggleBassetEnabled = useCallback<Dispatch['toggleBassetEnabled']>(
    bAsset => {
      dispatch({ type: Actions.ToggleBassetEnabled, payload: bAsset });
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
          () => ({
            setExactRedemptionAmount,
            setRedemptionAmount,
            toggleBassetEnabled,
            toggleMode,
          }),
          [
            setExactRedemptionAmount,
            setRedemptionAmount,
            toggleBassetEnabled,
            toggleMode,
          ],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useRedeemState = (): State => useContext(stateCtx);

export const useRedeemDispatch = (): Dispatch => useContext(dispatchCtx);

export const useRedeemBassetOutput = (
  address: string,
): BassetOutput | undefined => {
  const { bAssetOutputs } = useRedeemState();
  return useMemo(() => bAssetOutputs.find(b => b.address === address), [
    address,
    bAssetOutputs,
  ]);
};

export const useRedeemBassetData = (
  address: string,
): BassetData | undefined => {
  const { mAssetData } = useRedeemState();
  return useMemo(() => mAssetData?.bAssets.find(b => b.address === address), [
    mAssetData,
    address,
  ]);
};
