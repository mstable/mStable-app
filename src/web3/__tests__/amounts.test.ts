import { formatSimpleAmount } from '../amounts';

describe('amounts', () => {
  describe('formatSimpleAmount', () => {
    test('value: 0', () => {
      expect(formatSimpleAmount(0)).toBe('0.00');
    });
    test('value: 1', () => {
      expect(formatSimpleAmount(1)).toBe('1.00');
    });
    test('value: 1.1', () => {
      expect(formatSimpleAmount(1.1)).toBe('1.10');
    });
    test('value: 1.11', () => {
      expect(formatSimpleAmount(1.11)).toBe('1.11');
    });
    test('value: 1.1111111111111111', () => {
      expect(formatSimpleAmount(1.1111111111111111)).toBe('1.11');
    });
    test('value: 0.03', () => {
      expect(formatSimpleAmount(0.03)).toBe('0.03');
    });
    test('value: 0.3', () => {
      expect(formatSimpleAmount(0.3)).toBe('0.30');
    });
  });
});
