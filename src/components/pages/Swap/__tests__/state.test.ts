/* eslint-disable @typescript-eslint/no-explicit-any */

import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { useSwapState } from '../state';
import { Fields, Mode } from '../types';

type Ctx = ReturnType<typeof useSwapState>;

let ctx: HookResult<Ctx>;

const state = (): Ctx[0] => ctx.current[0];
const dispatch = (): Ctx[1] => ctx.current[1];

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
    ctx = renderHook(() => useSwapState()).result;
  });

  test('context', () => {
    expect(state()).toEqual({
      error: null,
      mAssetData: null,
      mode: Mode.Swap,
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

    expect(dispatch()).toEqual(expect.any(Object));
    // ^ https://www.youtube.com/watch?v=nfxpwbWBNuU
  });

  describe('without mAssetData', () => {
    test('updateMassetData', () => {
      act(() => {
        dispatch().updateMassetData(mAssetData);
      });

      expect(state()).toMatchObject({
        mAssetData,
      });
    });

    describe('setQuantity', () => {
      test('set input and invert direction', () => {
        act(() => {
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
            },
            output: {
              formValue: null,
            },
          },
        });

        act(() => {
          dispatch().invertDirection();
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: null,
            },
            output: {
              formValue: '10',
            },
          },
        });
      });

      test('set output and invert direction', () => {
        act(() => {
          dispatch().setQuantity(Fields.Output, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: null,
            },
            output: {
              formValue: '10',
            },
          },
        });

        act(() => {
          dispatch().invertDirection();
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
            },
            output: {
              formValue: null,
            },
            feeAmountSimple: null,
          },
        });
      });

      test('set both and invert direction', () => {
        act(() => {
          dispatch().setQuantity(Fields.Input, '42');
          dispatch().setQuantity(Fields.Output, '10');
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '42',
            },
            output: {
              formValue: '10',
            },
          },
        });

        act(() => {
          dispatch().invertDirection();
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '42',
            },
            output: {
              formValue: '10',
            },
          },
        });
      });
    });
  });

  describe('with mAssetData', () => {
    beforeEach(() => {
      act(() => {
        dispatch().updateMassetData(mAssetData);
      });
    });

    describe('swap', () => {
      test('Setting input quantity applies fee to output', () => {
        act(() => {
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, USDC);
          dispatch().setQuantity(Fields.Input, '10');
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
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, USDC);
          dispatch().setQuantity(Fields.Output, '10');
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
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setQuantity(Fields.Input, '10');
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
          dispatch().setToken(Fields.Output, USDC);
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
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, USDC);
          dispatch().setQuantity(Fields.Output, '10');
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
          dispatch().setQuantity(Fields.Input, '42');
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
                simple: 41.983,
              },
            },
            feeAmountSimple: '0.0168',
          },
        });
      });

      test('Changing either token to another bAsset keeps the same amounts', () => {
        act(() => {
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, USDC);
          dispatch().setQuantity(Fields.Input, '10');
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
          dispatch().setToken(Fields.Input, TUSD);
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
          dispatch().setToken(Fields.Input, USDC);
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
          dispatch().setToken(Fields.Output, USDC);
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
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, USDC);
          dispatch().setQuantity(Fields.Input, '10');
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
          dispatch().invertDirection();
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10',
              token: USDC,
            },
            output: {
              formValue: '9.996',
              token: DAI,
            },
            feeAmountSimple: '0.004',
          },
        });

        act(() => {
          dispatch().invertDirection();
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
          dispatch().setQuantity(Fields.Output, '10');
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

        act(() => {
          dispatch().invertDirection();
        });

        expect(state()).toMatchObject({
          values: {
            input: {
              formValue: '10.004',
              token: USDC,
            },
            output: {
              formValue: '10',
              token: DAI,
            },
            feeAmountSimple: '0.004',
          },
        });
      });

      test('When swapping, selecting a masset as output changes mode to mint and removes swap fee', () => {
        act(() => {
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, USDC);
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          mode: Mode.Swap,
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
          dispatch().setToken(Fields.Output, mUSD);
        });

        expect(state()).toMatchObject({
          mode: Mode.MintSingle,
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
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, mUSD);
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          mode: Mode.MintSingle,
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

      test('When minting, selecting a bAsset as output changes mode to swap and applies swap fee to the input', () => {
        act(() => {
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, mUSD);
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          mode: Mode.MintSingle,
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
          dispatch().setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          mode: Mode.Swap,
          values: {
            input: {
              formValue: '9.996',
              token: DAI,
              amount: {
                simple: 9.996,
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
          dispatch().setToken(Fields.Input, mUSD);
        });

        expect(state()).toMatchObject({
          mode: Mode.Swap,
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
          dispatch().setToken(Fields.Input, DAI);
          dispatch().setToken(Fields.Output, mUSD);
          dispatch().invertDirection();
        });

        expect(state()).toMatchObject({
          mode: Mode.MintSingle,
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
