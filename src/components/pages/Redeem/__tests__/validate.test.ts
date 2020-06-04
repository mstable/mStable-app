import { BigNumber } from 'ethers/utils';
import { validate } from '../validate';
import { BassetOutput, Mode, State, Reasons } from '../types';
import { MassetData } from '../../../../context/DataProvider/types';
import { BassetStatus } from '../../Mint/types';

describe('Redeem - validate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basket validation', () => {
    const baseState: State = {
      touched: false,
      mode: Mode.RedeemSingle,
      bAssetOutputs: [] as BassetOutput[],
      redemption: { amount: { exact: null, simple: null } },
      valid: false,
      applyFee: false,
    };

    test('invalid (but no errors) with untouched state', () => {
      expect(validate.applyValidation(baseState)).toMatchObject({
        error: undefined,
        valid: false,
      });
    });

    test('error when basket data is not loaded', () => {
      expect(
        validate.applyValidation({ ...baseState, touched: true }),
      ).toMatchObject({
        error: Reasons.FetchingData,
        valid: false,
      });
    });

    test('must redeem proportionally when basket is failed', () => {
      expect(
        validate.applyValidation({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: { failed: true },
            token: {},
          } as unknown) as MassetData,
        }),
      ).toMatchObject({
        error: Reasons.FetchingData,
        valid: false,
      });
    });

    test('must redeem proportionally when some bAssets are not normal state', () => {
      expect(
        validate.applyValidation({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: {},
            token: { balance: 1 },
            bAssets: [{ status: BassetStatus.BrokenAbovePeg }],
          } as unknown) as MassetData,
        }),
      ).toMatchObject({
        error: Reasons.MustRedeemProportionally,
        valid: false,
      });
    });

    test('must redeem proportionally when more than one bAsset is overweight', () => {
      expect(
        validate.applyValidation({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: {},
            token: { balance: 1 },
            bAssets: [
              { overweight: false },
              { overweight: true },
              { overweight: true },
            ],
          } as unknown) as MassetData,
        }),
      ).toMatchObject({
        error: Reasons.MustRedeemProportionally,
        valid: false,
      });
    });

    test('error when basket contains blacklisted asset', () => {
      expect(
        validate.applyValidation({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: {},
            token: { balance: 1 },
            bAssets: [{ status: BassetStatus.Blacklisted }],
          } as unknown) as MassetData,
        }),
      ).toMatchObject({
        error: Reasons.BasketContainsBlacklistedAsset,
        valid: false,
      });
    });

    test('error when undergoing recol', () => {
      expect(
        validate.applyValidation({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: { undergoingRecol: true },
            token: { balance: 1 },
            bAssets: [],
          } as unknown) as MassetData,
        }),
      ).toMatchObject({
        error: Reasons.RedemptionPausedDuringRecol,
        valid: false,
      });
    });
  });

  describe('redeemSingle validation', () => {
    const baseState: State = {
      touched: true,
      mode: Mode.RedeemSingle,
      bAssetOutputs: [] as BassetOutput[],
      redemption: { amount: { exact: null, simple: null } },
      valid: false,
      applyFee: false,
    };

    test('error when no token selected', () => {
      expect(
        validate.redeemSingleValidator({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: {},
            token: { balance: 1 },
            bAssets: [],
          } as unknown) as MassetData,
          bAssetOutputs: [{ enabled: false } as BassetOutput],
        }),
      ).toEqual([false, Reasons.NoTokenSelected]);
    });

    test('error when single overweight bAsset is not selected', () => {
      expect(
        validate.redeemSingleValidator({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: {},
            token: { balance: 1 },
            bAssets: [
              {
                status: BassetStatus.Normal,
                overweight: false,
                address: 'normal',
              },
              {
                status: BassetStatus.Normal,
                overweight: true,
                address: 'overweight',
              },
            ],
          } as unknown) as MassetData,
          bAssetOutputs: [
            { enabled: true, address: 'normal' },
            { enabled: false, address: 'overweight' },
          ] as BassetOutput[],
        }),
      ).toEqual([false, Reasons.MustRedeemOverweightBassets, ['overweight']]);
    });

    test('valid when single overweight bAsset is selected', () => {
      const spy = jest.spyOn(validate, 'redemptionValidator');
      spy.mockImplementationOnce(() => [true]);
      expect(
        validate.redeemSingleValidator({
          ...baseState,
          touched: true,
          mAssetData: ({
            basket: {},
            token: { balance: 1 },
            bAssets: [
              {
                status: BassetStatus.Normal,
                overweight: false,
                address: 'normal',
              },
              {
                status: BassetStatus.Normal,
                overweight: true,
                address: 'overweight',
              },
            ],
          } as unknown) as MassetData,
          bAssetOutputs: [
            { enabled: false, address: 'normal' },
            { enabled: true, address: 'overweight' },
          ] as BassetOutput[],
        }),
      ).toEqual([true]);
    });
  });

  describe('redeemSingle/redeemMulti common validation', () => {
    const baseState: State = {
      touched: true,
      mode: Mode.RedeemSingle,
      mAssetData: ({
        basket: {},
        token: { balance: '1', totalSupply: '1', decimals: 18 },
        bAssets: [
          {
            status: BassetStatus.Normal,
            overweight: false,
            address: 'normal',
            vaultBalance: '10000',
            token: {
              decimals: 18,
              totalSupply: '10000000000',
              balance: new BigNumber(1),
            },
            ratio: 1,
            maxWeight: '400000',
          },
        ],
      } as unknown) as MassetData,
      bAssetOutputs: [
        {
          enabled: true,
          address: 'normal',
          amount: { exact: null, simple: null },
        },
      ] as BassetOutput[],
      redemption: { amount: { exact: null, simple: null } },
      valid: false,
      applyFee: false,
    };

    test.only('error when output amounts are not set', () => {
      expect(
        validate.redemptionValidator({
          ...baseState,
          redemption: { amount: { exact: new BigNumber(1), simple: 1 } },
        }),
      ).toEqual([false, Reasons.AmountMustBeSet, ['normal']]);
    });

    test('error when output amounts are zero', () => {
      expect(
        validate.redemptionValidator({
          ...baseState,
          bAssetOutputs: [
            {
              ...baseState.bAssetOutputs[0],
              amount: { exact: new BigNumber(0), simple: 0 },
            },
          ],
          redemption: { amount: { exact: new BigNumber(1), simple: 1 } },
        }),
      ).toEqual([false, Reasons.AmountMustBeGreaterThanZero, ['normal']]);
    });

    test('error when amount exceeds mAsset balance', () => {
      expect(
        validate.redemptionValidator({
          ...baseState,
          bAssetOutputs: [
            {
              ...baseState.bAssetOutputs[0],
              amount: { exact: new BigNumber(10), simple: 10 },
            },
          ],
          redemption: { amount: { exact: new BigNumber(10), simple: 10 } },
        }),
      ).toEqual([false, Reasons.AmountExceedsBalance]);
    });

    test.todo('error when vault balance exceeded');
    test.todo('valid when vault balance is just under being exceeded');
    test.todo('error when some overweight bAssets not enabled');
    test.todo('valid when all overweight bAssets are enabled');
    test.todo('error when bAssets are pushed above max weight');
    test.todo('valid when bAssets are pushed just under max weight');
    test.todo(
      'must redeem proportionally when bAsset weights would become breached',
    );
    test.todo('valid when bAsset weights are just under being breached');
  });

  describe('redeemMasset validation', () => {
    test.todo('error when mAsset balance is not loaded');
    test.todo('error when amount is not set');
    test.todo('error when amount is zero');
    test.todo('error when amount exceeds balance');
    test.todo('error when no token selected');
    test.todo('error when nothing in basket to redeem');
    test.todo('error when not enough liquidity');
    test.todo('valid state');
  });
});
