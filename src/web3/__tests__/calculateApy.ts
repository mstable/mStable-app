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

  test('increase over 24 hours', () => {
    const result = calculateApy(
      {
        timestamp: 1,
        exchangeRate: '1.1',
      },
      {
        timestamp: 60 * 60 * 24,
        exchangeRate: '1.2',
      },
    );

    expect(formatUnits(result, 16)).toBe('3318.2202235084797732');
  });

  test('increase over 12 hours', () => {
    const result = calculateApy(
      {
        timestamp: 0,
        exchangeRate: '1.1',
      },
      {
        timestamp: 12 * 60 * 60,
        exchangeRate: '1.2',
      },
    );

    expect(formatUnits(result, 16)).toBe('6636.3636363636370206');
  });
});
