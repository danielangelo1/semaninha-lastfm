import { describe, it, expect } from 'vitest';

describe('Simple Test Suite', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const testString = 'Hello World';
    expect(testString.toLowerCase()).toBe('hello world');
    expect(testString.length).toBe(11);
  });

  it('should work with arrays', () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(testArray).toHaveLength(5);
    expect(testArray.includes(3)).toBe(true);
    expect(testArray.filter(n => n > 3)).toEqual([4, 5]);
  });
});
