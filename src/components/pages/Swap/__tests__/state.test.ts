/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dispatch, ReducerAction, ReducerState, useReducer } from 'react';
import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { Actions, Fields } from '../types';
import { initialState, reducer } from '../reducer';

type Ctx = [
  ReducerState<typeof reducer>,
  Dispatch<ReducerAction<typeof reducer>>,
];

let ctx: HookResult<Ctx>;

const state = (): Ctx[0] => ctx.current[0];
const dispatch = (): Ctx[1] => ctx.current[1];

const setQuantity = (field: Fields, formValue: string | null): void => {
  dispatch()({
    type: Actions.SetQuantity,
    payload: { formValue, field },
  });
};

const setToken = (field: Fields, payload: any): void => {
  dispatch()({
    type: Actions.SetToken,
    payload: {
      field,
      ...(payload ?? { address: null, symbol: null, decimals: null }),
    },
  });
};

const updateMassetData = (data: any): void => {
  dispatch()({
    type: Actions.UpdateMassetData,
    payload: data,
  });
};

const mUSD = {
  address: 'mUSD token address',
  decimals: 18,
  symbol: 'mUSD',
};

const DAI = {
  address: 'DAI token address',
  decimals: 10,
  symbol: 'DAI',
};

const USDC = {
  address: 'USDC token address',
  decimals: 6,
  symbol: 'USDC',
};

const TUSD = {
  address: 'TUSD token address',
  decimals: 18,
  symbol: 'TUSD',
};

const feeRate = '400000000000000';

const mAssetData = {
  bAssets: [{ token: DAI } as any, { token: USDC } as any],
  basket: {} as any,
  feeRate,
  token: mUSD as any,
  loading: false,
};

describe('Swap form state', () => {
  beforeEach(() => {
    ctx = renderHook(() => useReducer(reducer, initialState)).result;
  });

  test('context', () => {
    expect(state()).toEqual({
      applySwapFee: false,
      needsUnlock: false,
      touched: false,
      valid: false,
      values: {
        feeAmountSimple: null,
        input: {
          amount: {
            exact: null,
            simple: null,
          },
          formValue: null,
          token: {
            address: null,
            decimals: null,
            symbol: null,
          },
        },
        output: {
          amount: {
            exact: null,
            simple: null,
          },
          formValue: null,
          token: {
            address: null,
            decimals: null,
            symbol: null,
          },
        },
      },
    });
  });

  describe('without mAssetData', () => {
    test('updateMassetData', () => {
      act(() => {
        updateMassetData(mAssetData);
      });

      expect(state()).toMatchObject({
        mAssetData,
      });
    });
  });

  describe('with mAssetData', () => {
    beforeEach(() => {
      act(() => {
        updateMassetData(mAssetData);
      });
    });

    describe('swap', () => {
      test('Setting input quantity applies fee to output', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, USDC);
          setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
              amount: {
                simple: 10,
              },
            },
            output: {
              formValue: '9.996',
              token: USDC,
              amount: {
                simple: 9.996,
              },
            },
            feeAmountSimple: '0.004',
          },
        });
      });

      test('Setting output quantity applies fee to input', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, USDC);
          setQuantity(Fields.Output, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10.004',
              token: DAI,
              amount: {
                simple: 10.004,
              },
            },
            output: {
              formValue: '10',
              token: USDC,
              amount: {
                simple: 10,
              },
            },
            feeAmountSimple: '0.004',
          },
        });
      });

      // TODO not passing, bug
      test.skip('Setting the input token/amount and then setting the output token should set the output amount (and apply the fee)', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
            },
            output: {
              formValue: null,
              token: {
                address: null,
              },
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
            },
            output: {
              formValue: '9.996',
              token: USDC,
            },
            feeAmountSimple: '0.004',
          },
        });
      });

      test('Setting quantity to a field that already has a fee applied applies the fee to the other field', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, USDC);
          setQuantity(Fields.Output, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10.004',
              token: DAI,
              amount: {
                simple: 10.004,
              },
            },
            output: {
              formValue: '10',
              token: USDC,
              amount: {
                simple: 10,
              },
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          setQuantity(Fields.Input, '42');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '42',
              token: DAI,
              amount: {
                simple: 42,
              },
            },
            output: {
              formValue: '41.9832',
              token: USDC,
              amount: {
                simple: 41.9832,
              },
            },
            feeAmountSimple: '0.0168',
          },
        });
      });

      test('Changing either token to another bAsset keeps the same amounts', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, USDC);
          setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
            },
            output: {
              formValue: '9.996',
              token: USDC,
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          setToken(Fields.Input, TUSD);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: TUSD,
            },
            output: {
              formValue: '9.996',
              token: USDC,
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          setToken(Fields.Input, USDC);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: USDC,
            },
            output: {
              formValue: '9.996',
              token: TUSD,
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: TUSD,
            },
            output: {
              formValue: '9.996',
              token: USDC,
            },
            feeAmountSimple: '0.004',
          },
        });
      });

      test('Inverting direction back and forth keeps the amounts the same', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, USDC);
          setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
            },
            output: {
              formValue: '9.996',
              token: USDC,
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          setQuantity(Fields.Output, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10.004',
              token: DAI,
            },
            output: {
              formValue: '10',
              token: USDC,
            },
            feeAmountSimple: '0.004',
          },
        });
      });

      test('When swapping, selecting a masset as output changes mode to mint and removes swap fee', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, USDC);
          setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
            },
            output: {
              formValue: '9.996',
              token: USDC,
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          setToken(Fields.Output, mUSD);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
            },
            output: {
              formValue: '10',
              token: mUSD,
            },
            feeAmountSimple: null,
          },
        });
      });
    });

    describe('mint', () => {
      test('Minting does not add a fee', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, mUSD);
          setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
              amount: {
                simple: 10,
              },
            },
            output: {
              formValue: '10',
              token: mUSD,
              amount: {
                simple: 10,
              },
            },
            feeAmountSimple: null,
          },
        });
      });

      test('When minting, selecting a bAsset as output applies swap fee to the input', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, mUSD);
          setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: DAI,
              amount: {
                simple: 10,
              },
            },
            output: {
              formValue: '10',
              token: mUSD,
              amount: {
                simple: 10,
              },
            },
            feeAmountSimple: null,
          },
        });

        act(() => {
          setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10.004',
              token: DAI,
              amount: {
                simple: 10.004,
              },
            },
            output: {
              formValue: '10',
              token: USDC,
              amount: {
                simple: 10,
              },
            },
            feeAmountSimple: '0.004',
          },
        });
      });

      test('It is not possible to set mUSD as input (redeeming)', () => {
        act(() => {
          setToken(Fields.Input, mUSD);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              token: {
                address: null,
              },
            },
            output: {
              token: {
                address: null,
              },
            },
          },
        });
      });

      test('It is not possible to invert direction when minting', () => {
        act(() => {
          setToken(Fields.Input, DAI);
          setToken(Fields.Output, mUSD);
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              token: DAI,
            },
            output: {
              token: mUSD,
            },
          },
        });
      });
    });
  });
});

export {};
