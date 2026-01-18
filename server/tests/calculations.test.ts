import { calculateProgress } from '../src/utils/calculations';

describe('Unit Test: calculateProgress', () => {
  
  test('should return 0 if total lessons is 0', () => {
    const result = calculateProgress(5, 0);
    expect(result).toBe(0);
  });

  test('should calculate correct percentage', () => {
    const result = calculateProgress(2, 4);
    expect(result).toBe(50);
  });

  test('should round the result', () => {
    const result = calculateProgress(1, 3);
    expect(result).toBe(33);
  });

  test('should return 100 when all lessons are completed', () => {
    const result = calculateProgress(10, 10);
    expect(result).toBe(100);
  });
});