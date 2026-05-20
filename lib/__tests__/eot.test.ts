import { describe, it, expect } from 'vitest';
import { dayOfYear, equationOfTime, formatEoT } from '../eot';

describe('dayOfYear', () => {
  it('returns 1 for January 1', () => {
    expect(dayOfYear(new Date(2025, 0, 1))).toBe(1);
  });
  it('returns 365 for December 31 in a non-leap year', () => {
    expect(dayOfYear(new Date(2025, 11, 31))).toBe(365);
  });
});

describe('equationOfTime', () => {
  it('is near zero around mid-April (~April 15)', () => {
    const { eot } = equationOfTime(new Date(2025, 3, 15));
    expect(Math.abs(eot)).toBeLessThan(1.5);
  });

  it('reaches a maximum near early November (~+16 min)', () => {
    const { eot } = equationOfTime(new Date(2025, 10, 3));
    expect(eot).toBeGreaterThan(14);
  });

  it('reaches a minimum near mid-February (~-14 min)', () => {
    const { eot } = equationOfTime(new Date(2025, 1, 12));
    expect(eot).toBeLessThan(-12);
  });
});

describe('formatEoT', () => {
  it('formats positive values with + sign', () => {
    expect(formatEoT(16.4)).toMatch(/^\+16m/);
  });
  it('formats negative values with − sign', () => {
    expect(formatEoT(-14.2)).toMatch(/^−14m/);
  });
  it('pads minutes and seconds to 2 digits', () => {
    expect(formatEoT(1.5)).toBe('+01m 30s');
  });
});
