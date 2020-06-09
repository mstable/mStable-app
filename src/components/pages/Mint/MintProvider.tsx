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
import { pipe } from 'ts-pipe-compose';
import { BigNumber, parseUnits } from 'ethers/utils';

import {
  applyRatioBassetToMasset,
  applyRatioMassetToBasset,
} from '../../../web3/ratio';
import { formatExactAmount, parseExactAmount } from '../../../web3/amounts';
import { SCALE } from '../../../web3/constants';
import { useMusdData } from '../../../context/DataProvider/DataProvider';
import { BassetData, MassetData } from '../../../context/DataProvider/types';
import { Action, Actions, BassetInput, Dispatch, Mode, State } from './types';
import { applyValidation } from './validation';

const initialState: State = {
  bAssetInputs: [],
  mode: Mode.MintMulti,
  mintAmount: {
    exact: null,
    simple: null,
  },
  valid: false,
  touched: false,
};

const updateMintAmount = (state: State): State => {
  const ratios = (state.mAssetData?.bAssets || []).map(b => b.ratio);
  const mintAmount = parseExactAmount(
    state.bAssetInputs.reduce(
      (_mintAmount, { enabled, amount: { exact } }, index) =>
        enabled && exact
          ? _mintAmount.add(
              applyRatioBassetToMasset(exact, new BigNumber(ratios[index])),
            )
          : _mintAmount,
      new BigNumber(0),
    ),
    18,
  );
  return {
    ...state,
    mintAmount,
  };
};

const update = (state: State): State =>
  pipe(state, updateMintAmount, applyValidation);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.UpdateMassetData: {
      const mAssetData = action.payload;
      return update({
        ...state,
        mAssetData,
        bAssetInputs:
          state.bAssetInputs.length > 0
            ? state.bAssetInputs
            : mAssetData.bAssets.map(({ address }) => ({
                address,
                enabled: false,
                amount: { exact: null, simple: null },
                formValue: null,
              })),
      });
    }

    case Actions.SetBassetAmount: {
      const { amount, formValue, bAsset } = action.payload;
      return update({
        ...state,
        touched: true,
        bAssetInputs: state.bAssetInputs.map(b =>
          b.address === bAsset
            ? {
                ...b,
                amount,
                formValue,
              }
            : b,
        ),
      });
    }

    case Actions.SetBassetMaxAmount: {
      const { mode, bAssetInputs, mAssetData } = state;
      const [enabled] = bAssetInputs.filter(b => b.enabled);

      if (mode !== Mode.MintSingle || !enabled || !mAssetData?.bAssets) {
        return state;
      }

      const data = mAssetData.bAssets.find(b => b.address === enabled.address);

      if (data?.token?.balance) {
        const ratioedInputBalance = applyRatioBassetToMasset(
          data.token.balance,
          data.ratio,
        );

        // Determining max possible mint without pushing bAsset over max weight uses below formula
        // M = ((t * maxW) - c)/(1-maxW)
        // num = ((t * maxW) - c)
        const num1 = parseUnits(
          mAssetData.token.totalSupply,
          mAssetData.token.decimals,
        )
          .mul(data.maxWeight)
          .div(SCALE);
        const num2 = applyRatioBassetToMasset(
          parseUnits(data.vaultBalance, data.token.decimals),
          data.ratio,
        );
        const num = num1.sub(num2);

        // den = (1-maxW)
        const den = SCALE.sub(data.maxWeight);

        const maxMint = den.gt(0) ? num.mul(SCALE).div(den) : num;

        const clampedMax = maxMint.gt(ratioedInputBalance)
          ? ratioedInputBalance
          : maxMint;

        // Convert the max amount back to bAsset units
        const amount = parseExactAmount(
          applyRatioMassetToBasset(clampedMax, data.ratio),
          data.token.decimals,
        );
        const formValue = formatExactAmount(
          amount.exact as BigNumber,
          data.token.decimals,
        );

        return update({
          ...state,
          touched: true,
          bAssetInputs: state.bAssetInputs.map(b =>
            b.address === enabled.address
              ? {
                  ...b,
                  amount,
                  formValue,
                }
              : b,
          ),
        });
      }

      return state;
    }

    case Actions.ToggleBassetEnabled: {
      const address = action.payload;

      if (
        state.mAssetData?.bAssets.find(b => b.address === address)?.overweight
      ) {
        return state;
      }

      const bAssetInputs = state.bAssetInputs.map(b =>
        b.address === address
          ? {
              ...b,
              amount: !b.enabled ? b.amount : { exact: null, simple: null },
              formValue: !b.enabled ? b.formValue : null,
              enabled: !b.enabled,
            }
          : b,
      );
      return update({
        ...state,
        bAssetInputs,
        mode:
          bAssetInputs.filter(b => b.enabled).length === 1
            ? Mode.MintSingle
            : Mode.MintMulti,
      });
    }

    default:
      throw new Error('Unhandled action type');
  }
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const MintProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setBassetAmount = useCallback<Dispatch['setBassetAmount']>(
    (bAsset, formValue, amount) => {
      dispatch({
        type: Actions.SetBassetAmount,
        payload: { bAsset, amount, formValue },
      });
    },
    [dispatch],
  );

  const toggleBassetEnabled = useCallback<Dispatch['toggleBassetEnabled']>(
    bAsset => {
      dispatch({ type: Actions.ToggleBassetEnabled, payload: bAsset });
    },
    [dispatch],
  );

  const setBassetMaxAmount = useCallback<Dispatch['setBassetMaxAmount']>(() => {
    dispatch({ type: Actions.SetBassetMaxAmount });
  }, [dispatch]);

  const mUsdData = useMusdData();
  useEffect(() => {
    dispatch({ type: Actions.UpdateMassetData, payload: mUsdData });
  }, [mUsdData]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setBassetAmount,
            setBassetMaxAmount,
            toggleBassetEnabled,
          }),
          [setBassetAmount, setBassetMaxAmount, toggleBassetEnabled],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMintState = (): State => useContext(stateCtx);

export const useMintBassetInput = (
  address: string,
): BassetInput | undefined => {
  const { bAssetInputs } = useMintState();
  return useMemo(() => bAssetInputs.find(b => b.address === address), [
    bAssetInputs,
    address,
  ]);
};

export const useMintBassetData = (address: string): BassetData | null => {
  const { mAssetData } = useMintState();
  const bAssets = mAssetData?.bAssets;
  return useMemo(() => bAssets?.find(b => b.address === address) || null, [
    bAssets,
    address,
  ]);
};

export const useMintMode = (): State['mode'] => useMintState().mode;

export const useMintMassetToken = (): MassetData['token'] | undefined => {
  const { mAssetData } = useMintState();
  return mAssetData?.token;
};

export const useMintDispatch = (): Dispatch => useContext(dispatchCtx);

export const useMintToggleBassetEnabled = (): Dispatch['toggleBassetEnabled'] =>
  useMintDispatch().toggleBassetEnabled;

export const useMintSetBassetAmount = (): Dispatch['setBassetAmount'] =>
  useMintDispatch().setBassetAmount;

export const useMintSetBassetMaxAmount = (): Dispatch['setBassetMaxAmount'] =>
  useMintDispatch().setBassetMaxAmount;
