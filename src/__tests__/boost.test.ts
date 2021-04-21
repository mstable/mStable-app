import { BoostedSavingsVaultState } from '../context/DataProvider/types';
import {
  calculateBoost,
  calculateBoostImusd,
  calculateVMTAForMaxBoost,
  calculateVMTAForMaxBoostImusd,
  getCoeffs,
} from '../utils/boost';
import { BigDecimal } from '../web3/BigDecimal';

const mockVault = (address: string): BoostedSavingsVaultState => ({
  address,
  account: {
    boostedBalance: BigDecimal.ZERO,
    boostMultiplier: 0,
    rawBalance: BigDecimal.ZERO,
    lastAction: 0,
    lastClaim: 0,
    rewardCount: 0,
    rewardPerTokenPaid: BigDecimal.ZERO.exact,
    rewards: BigDecimal.ZERO.exact,
    rewardEntries: [
      {
        finish: 0,
        start: 0,
        index: 0,
        rate: BigDecimal.ZERO.exact,
      },
    ],
  },
  lastUpdateTime: 0,
  lockupDuration: 0,
  periodDuration: 0,
  periodFinish: 0,
  rewardPerTokenStored: BigDecimal.ZERO.exact,
  rewardRate: BigDecimal.ZERO.exact,
  stakingContract: '',
  stakingToken: '',
  totalStakingRewards: BigDecimal.ZERO,
  totalSupply: BigDecimal.ZERO,
  unlockPercentage: BigDecimal.ZERO.exact,
});

describe('test boost calculations', () => {
  test('it correctly calculates imusd boost', () => {
    const imUSDVault = mockVault('0x78BefCa7de27d07DC6e71da295Cc2946681A6c7B');
    const coeffs = getCoeffs(imUSDVault);
    expect(coeffs).toBe(undefined);

    const testValues = [
      {
        amount: BigDecimal.parse('30000'), // $3k
        mta: BigDecimal.parse('100'), // 100 mta
        expected: '1.54',
      },
      {
        amount: BigDecimal.parse('100'), // $10
        mta: BigDecimal.parse('0'),
        expected: '1.00',
      },
      {
        amount: BigDecimal.parse('300000'), // $30k
        mta: BigDecimal.parse('100'),
        expected: '1.07',
      },
    ];

    testValues.forEach(({ amount, mta, expected }) => {
      // calc boost & make sure == expected
      const boost = calculateBoostImusd(amount, mta).toFixed(2);
      expect(boost).toEqual(expected);

      // calc max mta & make sure boost == 3
      const maxMTA = BigDecimal.parse(
        calculateVMTAForMaxBoostImusd(amount)?.toFixed(2) ?? '0',
      );
      const maxBoost = calculateBoostImusd(amount, maxMTA).toFixed(2);
      expect(maxBoost).toEqual('3.00');
    });
  });

  test('it correctly calculates imbtc boost', () => {
    const imBTCVault = mockVault('0xf38522f63f40f9dd81abafd2b8efc2ec958a3016');
    const coeffs = getCoeffs(imBTCVault);

    if (!coeffs) {
      expect(coeffs).not.toBe(undefined);
      return;
    }

    const testValues = [
      {
        amount: BigDecimal.parse('1.724137931'), // $10k
        mta: BigDecimal.parse('175'), // 175 mta
        expected: '1.27',
      },
      {
        amount: BigDecimal.parse('10'), // $10
        mta: BigDecimal.parse('0'),
        expected: '1.00',
      },
      {
        amount: BigDecimal.parse('1.724137931'), // $10k
        mta: BigDecimal.parse('3000'),
        expected: '3.00',
      },
    ];

    testValues.forEach(({ amount, mta, expected }) => {
      // calc boost & make sure == expected
      const boost = calculateBoost(...coeffs, amount, mta).toFixed(2);
      expect(boost).toEqual(expected);

      // calc max mta & make sure boost == 3
      const maxMTA = BigDecimal.parse(
        calculateVMTAForMaxBoost(amount, ...coeffs).toFixed(2),
      );
      const maxBoost = calculateBoost(...coeffs, amount, maxMTA).toFixed(2);
      expect(maxBoost).toEqual('3.00');
    });
  });

  test('it correctly calculates musd feeder boosts', () => {
    const vaults = [
      mockVault('0xadeedd3e5768f7882572ad91065f93ba88343c99'),
      mockVault('0xd124b55f70d374f58455c8aedf308e52cf2a6207'),
    ];
    const coeffs = vaults.map(v => getCoeffs(v));

    const testValues = [
      {
        amount: BigDecimal.parse('3000'), // $3k
        mta: BigDecimal.parse('100'), // 100 mta
        expected: '1.44',
      },
      {
        amount: BigDecimal.parse('10'), // $10
        mta: BigDecimal.parse('0'),
        expected: '1.00',
      },
      {
        amount: BigDecimal.parse('30000'), // $30k
        mta: BigDecimal.parse('100'),
        expected: '1.06',
      },
    ];

    coeffs.forEach(coeff => {
      if (!coeff) {
        expect(coeff).not.toBe(undefined);
        return;
      }
      testValues.forEach(({ amount, mta, expected }) => {
        // calc boost & make sure == expected
        const boost = calculateBoost(...coeff, amount, mta).toFixed(2);
        expect(boost).toEqual(expected);

        // calc max mta & make sure boost == 3
        const maxMTA = BigDecimal.parse(
          calculateVMTAForMaxBoost(amount, ...coeff).toFixed(2),
        );
        const maxBoost = calculateBoost(...coeff, amount, maxMTA).toFixed(2);
        expect(maxBoost).toEqual('3.00');
      });
    });
  });

  test('it correctly calculates mbtc feeder boosts', () => {
    const vaults = [
      mockVault('0xf65d53aa6e2e4a5f4f026e73cb3e22c22d75e35c'),
      mockVault('0x760ea8cfdcc4e78d8b9ca3088ecd460246dc0731'),
    ];
    const coeffs = vaults.map(v => getCoeffs(v));

    const testValues = [
      {
        amount: BigDecimal.parse('0.1724137931'), // $10k
        mta: BigDecimal.parse('100'), // 100 mta
        expected: '1.15',
      },
      {
        amount: BigDecimal.parse('0.0001724137931'), // $10
        mta: BigDecimal.parse('0'),
        expected: '1.00',
      },
      {
        amount: BigDecimal.parse('1.724137931'), // $100k
        mta: BigDecimal.parse('1000'),
        expected: '1.20',
      },
    ];

    coeffs.forEach(coeff => {
      if (!coeff) {
        expect(coeff).not.toBe(undefined);
        return;
      }
      testValues.forEach(({ amount, mta, expected }) => {
        // calc boost & make sure == expected
        const boost = calculateBoost(...coeff, amount, mta).toFixed(2);
        expect(boost).toEqual(expected);

        // calc max mta & make sure boost == 3
        const maxMTA = BigDecimal.parse(
          calculateVMTAForMaxBoost(amount, ...coeff).toFixed(2),
        );
        const maxBoost = calculateBoost(...coeff, amount, maxMTA).toFixed(2);
        expect(maxBoost).toEqual('3.00');
      });
    });
  });
});
