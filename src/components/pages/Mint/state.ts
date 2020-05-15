import { Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  BigNumber,
  bigNumberify,
  BigNumberish,
  formatUnits,
  parseUnits,
} from 'ethers/utils';
import { pipe } from 'ts-pipe-compose';
import { Amount, TokenQuantity } from '../../../types';
import { formatSimpleAmount, parseAmount } from '../../../web3/amounts';
import { RATIO_SCALE } from '../../../web3/constants';
import { useMusdData } from '../../../context/DataProvider/DataProvider';
import { Action, Actions, Dispatch, Mode, State } from './types';
import { applyValidation } from './validation';

const initialTokenQuantity: TokenQuantity = Object.freeze({
  formValue: null,
  amount: {
    simple: null,
    exact: null,
  },
  token: {
    address: null,
    decimals: null,
    symbol: null,
  },
});

const initialState: State = Object.freeze({
  bAssetInputs: [],
  error: null,
  mAsset: initialTokenQuantity,
  mAssetData: null,
  mode: Mode.Single,
  valid: false,
  touched: false,
});

const applyRatioMassetToBasset = (
  input: BigNumberish,
  ratio: BigNumberish,
): BigNumber =>
  bigNumberify(input)
    .mul(RATIO_SCALE)
    .div(ratio);

const calcOptimalBassetQuantitiesForMint = ({
  mAsset,
  bAssetInputs,
  mAssetData,
}: State): Amount[] => {
  const enabledMaxWeightsTotal: BigNumber = bAssetInputs.reduce(
    (_total, { address, enabled }) => {
      const { maxWeight } =
        mAssetData?.bAssets.find(b => b.address === address) || {};

      return enabled && maxWeight ? _total.add(maxWeight) : _total;
    },
    new BigNumber(0),
  );

  return bAssetInputs.map(({ enabled, address }) => {
    const { maxWeight, ratio, token } =
      mAssetData?.bAssets.find(b => b.address === address) || {};

    if (
      !(enabled && maxWeight && ratio && token?.decimals && mAsset.amount.exact)
    ) {
      return { exact: new BigNumber(0), simple: 0 };
    }

    const weight = parseUnits(maxWeight).div(enabledMaxWeightsTotal);

    const relativeUnitsToMint = mAsset.amount.exact?.mul(weight);

    // TODO this is messy
    const formattedUnits = formatUnits(relativeUnitsToMint, 18);

    const exact = applyRatioMassetToBasset(formattedUnits.slice(0, -2), ratio);

    return { exact, simple: parseFloat(formatUnits(exact, token.decimals)) };
  });
};

const updateBAssetInputs = (state: State): State => {
  const bassetAmounts = calcOptimalBassetQuantitiesForMint(state);

  return {
    ...state,
    bAssetInputs: state.bAssetInputs.map((basset, index) => ({
      ...basset,
      amount: bassetAmounts[index],
      formValue: formatSimpleAmount(bassetAmounts[index].simple || 0),
    })),
  };
};

const update = (state: State): State =>
  pipe(state, updateBAssetInputs, applyValidation);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.UpdateMassetData: {
      const mAssetData = action.payload;
      const token = mAssetData?.token;
      return {
        ...state,
        mAssetData,
        mAsset: {
          ...state.mAsset,
          token:
            token && token.address && token.symbol && token.decimals
              ? {
                  address: token.address,
                  symbol: token.symbol,
                  decimals: token.decimals,
                }
              : state.mAsset.token,
        },
        bAssetInputs:
          state.bAssetInputs.length > 0
            ? state.bAssetInputs
            : mAssetData?.bAssets.map(({ address }) => ({
                address,
                enabled: false,
                amount: { exact: null, simple: null },
                error: null,
                formValue: null,
              })),
      };
    }

    case Actions.SetMassetAmount: {
      const mAssetAmount = parseAmount(
        action.payload,
        state.mAsset.token.decimals,
      );
      const mAsset = {
        ...state.mAsset,
        formValue: action.payload,
        amount: mAssetAmount,
      };
      return update({ ...state, mAsset, touched: true });
    }

    // TODO later: enable this action to set specific bAssetInputs amounts
    // case Actions.SetBassetAmount: {
    //   const { amount, basset } = action.payload;
    //   return {
    //     ...state,
    //     bAssetInputs: {
    //       ...state.bAssetInputs,
    //       [basset]: {
    //         ...state.bAssetInputs[basset],
    //         amount: parseAmount(amount, state.bAssetInputs[basset].token.decimals),
    //       },
    //     },
    //   };
    // }

    case Actions.ToggleBassetEnabled: {
      const address = action.payload;

      if (
        state.mode === Mode.Multi ||
        state.mAssetData?.bAssets.find(b => b.address === address)?.overweight
      ) {
        return state;
      }

      return update({
        ...state,
        bAssetInputs: state.bAssetInputs.map(b => ({
          ...b,
          enabled: b.address === address ? !b.enabled : false,
        })),
      });
    }

    case Actions.ToggleMode: {
      const mode = state.mode === Mode.Single ? Mode.Multi : Mode.Single;
      return update({
        ...state,
        mode,
        bAssetInputs: state.bAssetInputs.map(b =>
          mode === Mode.Single
            ? { ...b, enabled: false }
            : {
                ...b,
                enabled: !state.mAssetData?.bAssets.find(
                  _b => _b.address === b.address,
                )?.overweight,
              },
        ),
      });
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const useMintState = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setMassetAmount = useCallback<Dispatch['setMassetAmount']>(
    amount => {
      dispatch({ type: Actions.SetMassetAmount, payload: amount });
    },
    [dispatch],
  );

  const toggleMode = useCallback<Dispatch['toggleMode']>(() => {
    dispatch({ type: Actions.ToggleMode });
  }, [dispatch]);

  // TODO later: enable this action to set specific bassets amounts
  // const setBassetAmount = useCallback<Dispatch['setBassetAmount']>(
  //   (basset, amount) => {
  //     dispatch({ type: Actions.SetBassetAmount, payload: { basset, amount } });
  //   },
  //   [dispatch],
  // );

  const toggleBassetEnabled = useCallback<Dispatch['toggleBassetEnabled']>(
    basset => {
      dispatch({ type: Actions.ToggleBassetEnabled, payload: basset });
    },
    [dispatch],
  );

  const mUsdData = useMusdData();
  useEffect(() => {
    dispatch({ type: Actions.UpdateMassetData, payload: mUsdData });
  }, [mUsdData]);

  return useMemo(
    () => [
      state,
      {
        // setBassetAmount,
        setMassetAmount,
        toggleMode,
        toggleBassetEnabled,
      },
    ],
    [
      state,
      // setBassetAmount,
      setMassetAmount,
      toggleMode,
      toggleBassetEnabled,
    ],
  );
};
