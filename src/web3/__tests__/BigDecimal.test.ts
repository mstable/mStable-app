import { BigDecimal } from '../BigDecimal'

describe('BigDecimal', () => {
  test(`it doesn't scale the same decimals`, () => {
    const prev = new BigDecimal('420696', 6)
    const target = new BigDecimal('420696', 6)
    const scaled = prev.scale(6)
    expect(scaled.decimals).toBe(6)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales up', () => {
    const prev = new BigDecimal('420696', 6)
    const target = new BigDecimal('420696000000000000', 18)
    const scaled = prev.scale(18)
    expect(scaled.decimals).toBe(18)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales up larger numbers', () => {
    const prev = new BigDecimal('420696800813580085', 6)
    const target = new BigDecimal('420696800813580085000000000000', 18)
    const scaled = prev.scale(18)
    expect(scaled.decimals).toBe(18)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales down (losing precision)', () => {
    const prev = new BigDecimal('420696800813580085', 18)
    const target = new BigDecimal('420696', 6)
    const scaled = prev.scale(6)
    expect(scaled.decimals).toBe(6)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales down larger numbers (losing precision)', () => {
    const prev = new BigDecimal('420696800813580085420696800813580085', 18)
    const target = new BigDecimal('420696800813580085420696', 6)
    const scaled = prev.scale(6)
    expect(scaled.decimals).toBe(6)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales up from 0 decimals', () => {
    const prev = new BigDecimal('420696800813580085', 0)
    const target = new BigDecimal('420696800813580085000000000000000000', 18)
    const scaled = prev.scale(18)
    expect(scaled.decimals).toBe(18)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales down to 0 decimals', () => {
    const prev = new BigDecimal('420696800813580085000000000000000000', 18)
    const target = new BigDecimal('420696800813580085', 0)
    const scaled = prev.scale(0)
    expect(scaled.decimals).toBe(0)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales down to 1 decimal', () => {
    const prev = new BigDecimal('420696800813580085000000000000000000', 18)
    const target = new BigDecimal('4206968008135800850', 1)
    const scaled = prev.scale(1)
    expect(scaled.decimals).toBe(1)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it scales up to 1 decimal', () => {
    const prev = new BigDecimal('420696800813580085', 0)
    const target = new BigDecimal('4206968008135800850', 1)
    const scaled = prev.scale(1)
    expect(scaled.decimals).toBe(1)
    expect(scaled.exact.toString()).toBe(target.exact.toString())
  })

  test('it handles zero', () => {
    {
      const prev = new BigDecimal('0', 6)
      const target = new BigDecimal('0', 18)
      const scaled = prev.scale(18)
      expect(scaled.decimals).toBe(18)
      expect(scaled.exact.toString()).toBe(target.exact.toString())
    }
    {
      const prev = new BigDecimal('0', 18)
      const target = new BigDecimal('0', 6)
      const scaled = prev.scale(6)
      expect(scaled.decimals).toBe(6)
      expect(scaled.exact.toString()).toBe(target.exact.toString())
    }
  })
})
