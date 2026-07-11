import { describe, it, expect } from 'vitest';
import { formatCurrencyValue } from '../currency';

describe('formatCurrencyValue', () => {
  it('formats USD with 2 decimal places', () => {
    expect(formatCurrencyValue(100, 'USD')).toBe('USD 100.00');
  });

  it('formats JPY with 0 decimal places', () => {
    expect(formatCurrencyValue(5000, 'JPY')).toBe('JPY 5,000');
  });

  it('formats EUR with thousand separators and 2 decimals', () => {
    const result = formatCurrencyValue(1234.56, 'EUR');
    expect(result).toBe('EUR 1.234,56');
  });

  it('formats GBP with thousand separators', () => {
    const result = formatCurrencyValue(1000000.5, 'GBP');
    expect(result).toBe('GBP 1,000,000.50');
  });

  it('formats small values correctly', () => {
    expect(formatCurrencyValue(0.01, 'USD')).toBe('USD 0.01');
  });

  it('formats zero value', () => {
    expect(formatCurrencyValue(0, 'CAD')).toBe('CAD 0.00');
  });

  it('formats large values with thousand separators for INR', () => {
    const result = formatCurrencyValue(1234567.89, 'INR');
    // Indian locale uses grouping: 12,34,567.89
    expect(result).toBe('INR 12,34,567.89');
  });

  it('formats CHF with Swiss locale separators', () => {
    const result = formatCurrencyValue(1234.56, 'CHF');
    // Swiss locale uses apostrophe or narrow no-break space for grouping
    expect(result).toMatch(/^CHF\s/);
    expect(result).toContain('1');
    expect(result).toContain('234');
    expect(result).toContain('56');
  });

  it('formats AUD with 2 decimal places', () => {
    expect(formatCurrencyValue(99.9, 'AUD')).toBe('AUD 99.90');
  });
});
