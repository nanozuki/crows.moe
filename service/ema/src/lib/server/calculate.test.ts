import { expect, test } from 'vitest';
import { calculator } from './calculate';

test('should work', async () => {
  const voteItems = [
    { voteId: 1, workId: 1, ranking: 1 },
    { voteId: 1, workId: 2, ranking: 2 },
    { voteId: 1, workId: 3, ranking: 3 },
    { voteId: 2, workId: 1, ranking: 1 },
    { voteId: 2, workId: 2, ranking: 2 },
    { voteId: 2, workId: 3, ranking: 3 },
  ];
  const resultItems = [
    { workId: 1, ranking: 1 },
    { workId: 2, ranking: 2 },
    { workId: 3, ranking: 3 },
  ];
  expect(await calculator.calculate(voteItems)).toEqual(resultItems);
});

// Test the example in wikipedia: https://en.wikipedia.org/wiki/Schulze_method
// In the following example 45 voters rank 5 candidates.
//    Number of voters  Order of preference
//    5                 ACBED
//    5                 ADECB
//    8                 BEDAC
//    3                 CABED
//    7                 CAEBD
//    2                 CBADE
//    7                 DCEBA
//    8                 EBADC
// The result should be: E > A > C > B > D
// In test, mapping the ABCDE to workId 1 to 5. Construct all 45 votes.
test('example in wikipedia', async () => {
  const example: { count: number; works: number[] }[] = [
    { count: 5, works: [1, 3, 2, 5, 4] },
    { count: 5, works: [1, 4, 5, 3, 2] },
    { count: 8, works: [2, 5, 4, 1, 3] },
    { count: 3, works: [3, 1, 2, 5, 4] },
    { count: 7, works: [3, 1, 5, 2, 4] },
    { count: 2, works: [3, 2, 1, 4, 5] },
    { count: 7, works: [4, 3, 5, 2, 1] },
    { count: 8, works: [5, 2, 1, 4, 3] },
  ];
  const voteItems = [];
  let voteId = 1;
  for (const { count, works } of example) {
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < works.length; j++) {
        voteItems.push({ voteId, workId: works[j], ranking: j + 1 });
      }
      voteId++;
    }
  }
  const resultItems = [
    { workId: 5, ranking: 1 },
    { workId: 1, ranking: 2 },
    { workId: 3, ranking: 3 },
    { workId: 2, ranking: 4 },
    { workId: 4, ranking: 5 },
  ];
  expect(await calculator.calculate(voteItems)).toEqual(resultItems);
});
