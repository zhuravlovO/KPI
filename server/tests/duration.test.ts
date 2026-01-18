// server/tests/duration.test.ts
import { getTotalDuration, parseToSeconds } from '../src/utils/duration';

describe('Unit Test: Duration Calculator', () => {

  test('correctly converts time string to seconds', () => {
    expect(parseToSeconds('10:30')).toBe(630); // 10*60 + 30
    expect(parseToSeconds('01:00:00')).toBe(3600);
  });

  test('returns "0 хв" if array is empty', () => {
    expect(getTotalDuration([])).toBe('0 хв');
  });

  test('calculates total duration of multiple lessons', () => {
    const lessons = [
      { duration: '10:00' }, 
      { duration: '05:30' }
    ];
    expect(getTotalDuration(lessons)).toBe('15 хв');
  });

  test('handles huge duration (hours)', () => {
    const lessons = [
      { duration: '40:00' },
      { duration: '40:00' }
    ];
    expect(getTotalDuration(lessons)).toBe('1 год 20 хв');
  });

  test('ignores invalid time formats safely', () => {
    const lessons = [
      { duration: '10:00' },
      { duration: 'blabla' } 
    ];
    expect(getTotalDuration(lessons)).toBe('10 хв');
  });
});