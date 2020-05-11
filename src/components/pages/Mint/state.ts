import { Reducer, useCallback, useMemo, useReducer } from 'react';
import {
  BigNumber,
  bigNumberify,
  BigNumberish,
  formatUnits,
  parseUnits,
} from 'ethers/utils';
import { Amount, TokenQuantity } from '../../../types';
import { formatSimpleAmount, parseAmount } from '../../../web3/amounts';
import {
  Action,
  Actions,
  Basset,
  BassetStatus,
  Dispatch,
  Mode,
  State,
} from './types';
import { RATIO_SCALE } from '../../../web3/constants';

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
  initialized: false,
  error: null,
  masset: initialTokenQuantity,
  bassets: [],
  basket: null,
  mode: Mode.Single,
});

const applyRatioMassetToBasset = (
  input: BigNumberish,
  ratio: BigNumberish,
): BigNumber =>
  bigNumberify(input)
    .mul(RATIO_SCALE)
    .div(ratio);

const calcOptimalBassetQuantitiesForMint = ({
  masset,
  bassets,
  basket,
}: State): Amount[] => {
  const enabledMaxWeightsTotal: BigNumber = bassets.reduce(
    (_total, { address, enabled }) => {
      if (!enabled) return _total;

      // TODO later (awaiting subgraph) - use maxWeight
      const { maxWeight } =
        (basket as NonNullable<typeof basket>).bassets.find(
          b => b.token.address === address,
        ) || {};
      return _total.add(maxWeight as string);
    },
    new BigNumber(0),
  );

  return bassets.map(({ enabled, address }) => {
    if (!enabled) {
      return { exact: new BigNumber(0), simple: 0 };
    }

    const {
      maxWeight,
      ratio,
      token: { decimals },
    } = basket?.bassets.find(b => b.token.address === address) as NonNullable<
      State['basket']
    >['bassets'][0];

    // TODO later (awaiting subgraph) - use maxWeight
    const weight = parseUnits(maxWeight).div(enabledMaxWeightsTotal);

    const relativeUnitsToMint = masset.amount.exact?.mul(weight);
    const formattedUnits = formatUnits(relativeUnitsToMint || '0', 18);
    const exact = applyRatioMassetToBasset(formattedUnits.slice(0, -2), ratio);

    return { exact, simple: parseFloat(formatUnits(exact, decimals)) };
  });
};

const updateBassetQuantities = (state: State): State => {
  const bassetAmounts = calcOptimalBassetQuantitiesForMint(state);

  return {
    ...state,
    bassets: state.bassets.map((basset, index) => ({
      ...basset,
      amount: bassetAmounts[index],
      formValue: formatSimpleAmount(bassetAmounts[index].simple || 0),
    })),
  };
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Initialize: {
      const { masset, basket } = action.payload;
      return {
        ...state,
        masset: {
          ...state.masset,
          token: masset,
        },
        basket,
        bassets: basket.bassets.reduce(
          (
            _bassets,
            {
              token: { address, decimals, totalSupply },
              vaultBalance,
              maxWeight,
              status,
              ratio,
            },
            index,
          ) => {
            const maxWeightInUnits = parseUnits(totalSupply, decimals)
              .mul(maxWeight)
              .div((1e18).toString());
            const currentVaultUnits = parseUnits(vaultBalance, decimals)
              .mul(ratio)
              .div((1e8).toString());
            const overweight =
              parseUnits(totalSupply, decimals).gt(0) &&
              currentVaultUnits.gt(maxWeightInUnits);

            const enabledBasset = _bassets.find(b => b.enabled);

            return [
              ..._bassets,
              {
                address,
                amount: { simple: null, exact: null },
                balance: null,
                // TODO the basset with the highest balance should be enabled
                //  by default.
                enabled:
                  (!overweight && !enabledBasset) ||
                  (!enabledBasset && index === basket.bassets.length - 1),
                error: null,
                formValue: null,
                maxWeight: maxWeightInUnits,
                overweight,
                needsUnlock: false,
                status: status as BassetStatus,
              },
            ];
          },
          [] as Basset[],
        ),
        initialized: true,
      };
    }
    case Actions.SetBassetBalance: {
      const { basset, balance } = action.payload;
      return updateBassetQuantities({
        ...state,
        bassets: state.bassets.map(b =>
          b.address === basset ? { ...b, balance } : b,
        ),
      });
    }
    case Actions.SetError: {
      const { basset, reason } = action.payload;
      return basset
        ? {
            ...state,
            bassets: state.bassets.map(b =>
              b.address === basset ? { ...b, error: reason } : b,
            ),
          }
        : { ...state, error: reason };
    }
    case Actions.SetMassetAmount: {
      const massetAmount = parseAmount(
        action.payload,
        state.masset.token.decimals,
      );
      const masset = {
        ...state.masset,
        formValue: action.payload,
        amount: massetAmount,
      };
      return updateBassetQuantities({ ...state, masset });
    }
    // TODO later: enable this action to set specific bassets amounts
    // case Actions.SetBassetAmount: {
    //   const { amount, basset } = action.payload;
    //   return {
    //     ...state,
    //     bassets: {
    //       ...state.bassets,
    //       [basset]: {
    //         ...state.bassets[basset],
    //         amount: parseAmount(amount, state.bassets[basset].token.decimals),
    //       },
    //     },
    //   };
    // }
    case Actions.ToggleBassetEnabled: {
      const address = action.payload;

      if (
        state.mode === Mode.Multi ||
        state.bassets.find(b => b.address === address)?.overweight
      ) {
        return state;
      }

      return updateBassetQuantities({
        ...state,
        bassets: state.bassets.map(b => ({
          ...b,
          enabled: b.address === address ? !b.enabled : false,
        })),
      });
    }
    case Actions.ToggleMode: {
      const mode = state.mode === Mode.Single ? Mode.Multi : Mode.Single;
      return updateBassetQuantities({
        ...state,
        mode,
        bassets: state.bassets.map(b =>
          mode === Mode.Single
            ? { ...b, enabled: false }
            : { ...b, enabled: !b.overweight },
        ),
      });
    }
    default:
      throw new Error('Unhandled action type');
  }
};

export const useMintState = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback<Dispatch['initialize']>(
    (masset, basket) => {
      dispatch({ type: Actions.Initialize, payload: { masset, basket } });
    },
    [dispatch],
  );

  const setMassetAmount = useCallback<Dispatch['setMassetAmount']>(
    amount => {
      dispatch({ type: Actions.SetMassetAmount, payload: amount });
    },
    [dispatch],
  );

  const setBassetBalance = useCallback<Dispatch['setBassetBalance']>(
    (basset, balance) => {
      dispatch({
        type: Actions.SetBassetBalance,
        payload: { basset, balance },
      });
    },
    [dispatch],
  );

  const setError = useCallback<Dispatch['setError']>(
    (reason, basset) => {
      dispatch({ type: Actions.SetError, payload: { reason, basset } });
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

  return useMemo(
    () => [
      state,
      {
        initialize,
        // setBassetAmount,
        setBassetBalance,
        setError,
        setMassetAmount,
        toggleMode,
        toggleBassetEnabled,
      },
    ],
    [
      state,
      initialize,
      // setBassetAmount,
      setBassetBalance,
      setError,
      setMassetAmount,
      toggleMode,
      toggleBassetEnabled,
    ],
  );
};
