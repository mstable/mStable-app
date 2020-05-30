import { formatUnits } from 'ethers/utils';
import { calculateApy } from '../hooks';

describe('calculateAPY', () => {
  test('no rate difference gives 0 APY', () => {
    const result = calculateApy(
      {
        timestamp: 0,
        exchangeRate: '1',
      },
      {
        timestamp: 1,
        exchangeRate: '1',
      },
    );

    expect(formatUnits(result, 16)).toBe('0.0');
  });

  // ~0.1% increase per day, linear = 36.5%, compounded = 39.3%
  test('increase over 24 hours', () => {
    const result = calculateApy(
      {
        timestamp: 1,
        exchangeRate: '1.1',
      },
      {
        timestamp: 60 * 60 * 24,
        exchangeRate: '1.101',
      },
    );

    expect(formatUnits(result, 16)).toBe('39.32894285');
  });

  // ~0.45% increase per day, linear = 164%, compounded = 423.4%
  test('increase over 24 hours', () => {
    const result = calculateApy(
      {
        timestamp: 0,
        exchangeRate: '1.1',
      },
      {
        timestamp: 24 * 60 * 60,
        exchangeRate: '1.105',
      },
    );

    expect(formatUnits(result, 16)).toBe('423.48156844');
  });

  // ~0.1% increase per 12h, linear = 73%, compounded = 94%
  test('increase over 12 hours', () => {
    const result = calculateApy(
      {
        timestamp: 0,
        exchangeRate: '1.1',
      },
      {
        timestamp: 12 * 60 * 60,
        exchangeRate: '1.101',
      },
    );

    expect(formatUnits(result, 16)).toBe('94.12554315');
  });
});
