import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { Reasons, TransactionType, useSaveState } from '../state';

type Ctx = ReturnType<typeof useSaveState>;

let ctx: HookResult<Ctx>;

const state = (): Ctx[0] => ctx.current[0];
const dispatch = (): Ctx[1] => ctx.current[1];

const mUSD = {
  address: 'mUSD token address',
  decimals: 18,
  symbol: 'mUSD',
};

describe('Swap form state', () => {
  beforeEach(() => {
    ctx = renderHook(() => useSaveState()).result;
  });

  test('context', () => {
    expect(state()).toEqual(expect.any(Object));
    expect(dispatch()).toEqual(expect.any(Object));
  });

  describe('setError', () => {
    test('errors can be set', () => {
      act(() => {
        dispatch().setError(Reasons.AmountMustBeSet);
      });

      expect(state()).toMatchObject({
        error: Reasons.AmountMustBeSet,
      });
    });

    test('errors can be set and then unset', () => {
      act(() => {
        dispatch().setError(Reasons.AmountMustBeSet);
      });

      act(() => {
        dispatch().setError(null);
      });

      expect(state()).toMatchObject({
        error: null,
      });
    });
  });

  describe('setTransactionType', () => {
    test('transaction type can be changed', () => {
      act(() => {
        dispatch().setTransactionType(TransactionType.Withdraw);
      });

      expect(state()).toMatchObject({
        transactionType: TransactionType.Withdraw,
      });

      act(() => {
        dispatch().setTransactionType(TransactionType.Deposit);
      });

      expect(state()).toMatchObject({
        transactionType: TransactionType.Deposit,
      });
    });
  });

  describe('setToken', () => {
    test('input token can be set', () => {
      act(() => {
        dispatch().setToken(mUSD);
      });

      expect(state()).toMatchObject({
        input: {
          token: mUSD,
          amount: {
            simple: null,
          },
        },
      });
    });

    test('input token can be set and then unset', () => {
      act(() => {
        dispatch().setToken(mUSD);
      });

      act(() => {
        dispatch().setToken({ address: null, symbol: null, decimals: null });
      });

      expect(state()).toMatchObject({
        input: {
          token: {
            address: null,
            symbol: null,
            decimals: null,
          },
          amount: {
            simple: null,
          },
        },
      });
    });
  });

  describe('setQuantity', () => {
    test('input amount can be set', () => {
      act(() => {
        dispatch().setQuantity('10');
      });

      expect(state()).toMatchObject({
        input: {
          token: {
            address: null,
          },
          amount: {
            simple: '10',
          },
        },
      });
    });

    test('input amount can be set and then unset', () => {
      act(() => {
        dispatch().setQuantity('10');
      });

      act(() => {
        dispatch().setQuantity(null);
      });

      expect(state()).toMatchObject({
        input: {
          token: {
            address: null,
          },
          amount: {
            simple: null,
          },
        },
      });
    });
  });
});
