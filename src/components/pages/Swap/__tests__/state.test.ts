import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { BigNumber } from 'ethers/utils';
import { Fields, TransactionType, useSwapState } from '../state';

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

const feeRate = new BigNumber(2000000000000000);

describe('Swap form state', () => {
  beforeEach(() => {
    ctx = renderHook(() => useSwapState()).result;
  });

  test('context', () => {
    expect(state()).toEqual(expect.any(Object));
    expect(dispatch()).toEqual(expect.any(Object));
    // ^ https://www.youtube.com/watch?v=nfxpwbWBNuU
  });

  test('setMUSD', () => {
    act(() => {
      dispatch().setMUSD(mUSD);
    });

    act(() => {
      dispatch().setQuantity(Fields.Output, '10');
    });

    expect(state()).toMatchObject({
      transactionType: TransactionType.Mint,
      mUSD,
      values: {
        input: {
          token: {
            address: null,
          },
          amount: {
            simple: '10',
          },
        },
        output: {
          token: mUSD,
          amount: {
            simple: '10',
          },
        },
      },
    });
  });

  test('setFeeRate', () => {
    act(() => {
      dispatch().setFeeRate(feeRate);
    });

    expect(state()).toMatchObject({
      feeRate,
    });
  });

  describe('setToken', () => {
    test('input', () => {
      act(() => {
        dispatch().setToken(Fields.Input, DAI);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      expect(state()).toMatchObject({
        transactionType: TransactionType.Mint,
        values: {
          input: {
            token: DAI,
            amount: {
              simple: '10',
            },
          },
          output: {
            token: {
              address: null,
            },
            amount: {
              simple: '10',
            },
          },
        },
      });
    });

    test.skip('output', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setToken(Fields.Output, DAI);
      });

      act(() => {
        dispatch().setFeeRate(feeRate);
      });

      act(() => {
        dispatch().setQuantity(Fields.Output, '10');
      });

      expect(state()).toMatchObject({
        transactionType: TransactionType.Redeem,
        values: {
          input: {
            token: mUSD,
            amount: {
              simple: '10.02', // FIXME
            },
          },
          output: {
            token: DAI,
            amount: {
              simple: '10',
            },
          },
        },
      });
    });

    test('mUSD switched to output token', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setToken(Fields.Input, DAI);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            token: DAI,
            amount: {
              simple: '10',
            },
          },
          output: {
            token: mUSD,
            amount: {
              simple: '10',
            },
          },
        },
      });
    });

    test('swapping via setting input token', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setToken(Fields.Input, DAI);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            token: DAI,
            amount: {
              simple: '10',
            },
          },
          output: {
            token: mUSD,
            amount: {
              simple: '10',
            },
          },
        },
      });
    });

    test('swapping via setting output token', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setFeeRate(feeRate);
      });

      act(() => {
        dispatch().setToken(Fields.Input, DAI);
      });

      act(() => {
        dispatch().setToken(Fields.Output, DAI);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            token: mUSD,
            amount: {
              simple: '10',
            },
          },
          output: {
            token: DAI,
            amount: {
              simple: '9.98',
            },
          },
        },
      });
    });

    test('swapping via setting another basset as input token', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setFeeRate(feeRate);
      });

      act(() => {
        dispatch().setToken(Fields.Output, DAI);
      });

      act(() => {
        dispatch().setToken(Fields.Input, USDC);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            // Input should be set to USDC (the last action taken)
            token: USDC,
            amount: {
              simple: '10',
            },
          },
          output: {
            // Output should be set back to mUSD (masset needs to be selected)
            token: mUSD,
            amount: {
              simple: '10',
            },
          },
        },
      });
    });

    test('swapping via setting another basset as output token', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setFeeRate(feeRate);
      });

      act(() => {
        dispatch().setToken(Fields.Input, DAI);
      });

      act(() => {
        dispatch().setToken(Fields.Output, USDC);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            // Input should be set back to mUSD (masset needs to be selected)
            token: mUSD,
            amount: {
              simple: '10',
            },
          },
          output: {
            // Output should be set to USDC (the last action taken)
            token: USDC,
            amount: {
              simple: '9.98',
            },
          },
        },
      });
    });

    test('unsetting input token', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setFeeRate(feeRate);
      });

      act(() => {
        dispatch().setToken(Fields.Input, DAI);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      act(() => {
        dispatch().setToken(Fields.Input, null);
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            token: {
              address: null,
            },
            amount: {
              simple: '10', // The amount should remain set
            },
          },
          output: {
            token: mUSD,
            amount: {
              simple: '10',
            },
          },
        },
      });
    });

    test('unsetting output token', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      act(() => {
        dispatch().setToken(Fields.Input, DAI);
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      act(() => {
        dispatch().setToken(Fields.Output, null);
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            token: DAI,
            amount: {
              simple: '10', // The amount should remain set
            },
          },
          output: {
            token: {
              address: null,
            },
            amount: {
              simple: '10',
            },
          },
        },
      });
    });
  });

  describe('setQuantity', () => {
    test('no tokens selected', () => {
      act(() => {
        dispatch().setQuantity(Fields.Input, '10');
      });

      expect(state()).toMatchObject({
        transactionType: TransactionType.Mint,
        values: {
          input: {
            amount: {
              simple: '10',
            },
          },
          output: {
            amount: {
              simple: '10',
            },
          },
        },
      });

      act(() => {
        dispatch().setQuantity(Fields.Output, '42');
      });

      expect(state()).toMatchObject({
        transactionType: TransactionType.Mint,
        values: {
          input: {
            amount: {
              simple: '42',
            },
          },
          output: {
            amount: {
              simple: '42',
            },
          },
        },
      });
    });

    describe('mint', () => {
      test('set input quantity, then output quantity', () => {
        act(() => {
          dispatch().setMUSD(mUSD);
        });

        act(() => {
          dispatch().setToken(Fields.Input, DAI);
        });

        act(() => {
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
          values: {
            input: {
              token: DAI,
              amount: {
                simple: '10',
              },
            },
            output: {
              token: mUSD,
              amount: {
                simple: '10',
              },
            },
          },
        });

        act(() => {
          dispatch().setQuantity(Fields.Output, '42');
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
          values: {
            input: {
              token: DAI,
              amount: {
                simple: '42',
              },
            },
            output: {
              token: mUSD,
              amount: {
                simple: '42',
              },
            },
          },
        });
      });
    });
  });
});

export {};
