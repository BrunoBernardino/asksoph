import { assertEquals } from 'std/assert/assert_equals.ts';
import { dateDiffInDays } from './utils.ts';

Deno.test('that dateDiffInDays works', () => {
  const tests = [
    {
      input: {
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-01'),
      },
      expected: 0,
    },
    {
      input: {
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-02'),
      },
      expected: 1,
    },
    {
      input: {
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-12-02'),
      },
      expected: 335,
    },
  ];

  for (const test of tests) {
    const output = dateDiffInDays(
      test.input.startDate,
      test.input.endDate,
    );
    assertEquals(output, test.expected);
  }
});
