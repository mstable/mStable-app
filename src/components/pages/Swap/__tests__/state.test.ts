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

  describe('without initialisation', () => {
    test('setMUSD', () => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });

      expect(state()).toMatchObject({
        mUSD,
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

    test('setQuantity', () => {
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
        dispatch().swapTransactionType();
      });

      expect(state()).toMatchObject({
        transactionType: TransactionType.Redeem,
      });

      act(() => {
        dispatch().setQuantity(Fields.Input, '42');
      });

      expect(state()).toMatchObject({
        values: {
          input: {
            amount: {
              simple: '42',
            },
          },
          output: {
            amount: {
              // When redeeming, this can't be inferred without a fee set
              simple: null,
            },
          },
        },
      });
    });
  });

  describe('with initialisation', () => {
    beforeEach(() => {
      act(() => {
        dispatch().setMUSD(mUSD);
      });
      act(() => {
        dispatch().setFeeRate(feeRate);
      });
    });

    describe('mint', () => {
      test('mint with DAI by setting input quantity', () => {
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
      });

      test('mint with DAI by setting output quantity', () => {
        act(() => {
          dispatch().setToken(Fields.Input, DAI);
        });

        act(() => {
          dispatch().setQuantity(Fields.Output, '10');
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
      });
    });

    describe('redeem', () => {
      test('redeem DAI by setting input quantity', () => {
        act(() => {
          dispatch().setToken(Fields.Output, DAI);
        });

        act(() => {
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
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

      test('redeem DAI by setting output quantity', () => {
        act(() => {
          dispatch().setToken(Fields.Output, DAI);
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
                simple: '10.02',
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
    });

    describe('setToken', () => {
      test('setting minting input from DAI to USDC does not change type', () => {
        act(() => {
          dispatch().setQuantity(Fields.Input, '10');
        });

        act(() => {
          dispatch().setToken(Fields.Input, DAI);
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
          dispatch().setToken(Fields.Input, USDC);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
          values: {
            input: {
              token: USDC,
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

      test('setting minting output from mUSD to USDC changes type to redeem', () => {
        act(() => {
          dispatch().setQuantity(Fields.Input, '10');
        });

        act(() => {
          dispatch().setToken(Fields.Input, USDC);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
          values: {
            input: {
              token: USDC,
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
          dispatch().setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
              amount: {
                simple: '10',
              },
            },
            output: {
              token: USDC,
              amount: {
                simple: '9.98',
              },
            },
          },
        });
      });

      test('setting minting output from mUSD, to DAI, to USDC changes type to redeem and input to mUSD', () => {
        act(() => {
          dispatch().setToken(Fields.Input, DAI);
        });

        act(() => {
          dispatch().setToken(Fields.Output, DAI);
        });

        act(() => {
          dispatch().setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
            },
            output: {
              token: USDC,
            },
          },
        });
      });

      test('setting redeeming output from DAI to USDC does not change type', () => {
        act(() => {
          dispatch().setToken(Fields.Output, DAI);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
            },
            output: {
              token: DAI,
            },
          },
        });

        act(() => {
          dispatch().setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
            },
            output: {
              token: USDC,
            },
          },
        });
      });

      test('setting redeeming output from USDC to mUSD changes type to mint', () => {
        act(() => {
          dispatch().setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
            },
            output: {
              token: USDC,
            },
          },
        });

        act(() => {
          dispatch().setToken(Fields.Output, mUSD);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
          values: {
            input: {
              token: USDC,
            },
            output: {
              token: mUSD,
            },
          },
        });
      });

      test('setting redeeming output from DAI, to USDC, to mUSD changes type to mint and input to USDC', () => {
        act(() => {
          dispatch().setToken(Fields.Output, DAI);
        });

        act(() => {
          dispatch().setToken(Fields.Output, USDC);
        });

        act(() => {
          dispatch().setToken(Fields.Output, mUSD);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
          values: {
            input: {
              token: USDC,
            },
            output: {
              token: mUSD,
            },
          },
        });
      });

      test('setting input to mUSD, then setting input amount, then setting output to USDC should set output amount with fee', () => {
        act(() => {
          dispatch().setToken(Fields.Input, mUSD);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
              amount: {
                simple: null,
              },
            },
            output: {
              token: {
                address: null,
              },
              amount: {
                simple: null,
              },
            },
          },
        });

        act(() => {
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
              amount: {
                simple: '10',
              },
            },
            output: {
              token: {
                address: null,
              },
              amount: {
                simple: '9.98',
              },
            },
          },
        });

        act(() => {
          dispatch().setToken(Fields.Output, USDC);
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
              amount: {
                simple: '10',
              },
            },
            output: {
              token: USDC,
              amount: {
                simple: '9.98',
              },
            },
          },
        });
      });
    });

    describe('swapTransactionType', () => {
      test('swap changes type, tokens/amounts and applies the fee if needed', () => {
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
          dispatch().swapTransactionType();
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
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

        act(() => {
          dispatch().swapTransactionType();
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
      });

      test('swapping with only mUSD set retains the amount set', () => {
        act(() => {
          dispatch().setQuantity(Fields.Input, '10');
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
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

        act(() => {
          dispatch().swapTransactionType();
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
              amount: {
                simple: '10',
              },
            },
            output: {
              token: {
                address: null,
              },
              amount: {
                simple: '9.98',
              },
            },
          },
        });

        act(() => {
          dispatch().swapTransactionType();
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Mint,
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

        act(() => {
          dispatch().swapTransactionType();
        });

        expect(state()).toMatchObject({
          transactionType: TransactionType.Redeem,
          values: {
            input: {
              token: mUSD,
              amount: {
                simple: '10',
              },
            },
            output: {
              token: {
                address: null,
              },
              amount: {
                simple: '9.98',
              },
            },
          },
        });
      });
    });
  });
});

export {};
