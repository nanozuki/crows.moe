import {
  Ballot,
  compressBallotForSubmit,
  expandBallotForEdit,
} from '../components/BallotEditor/ballot';

describe('expandBallotForEdit', () => {
  interface test {
    name: string;
    in: Ballot;
    out: Ballot;
  }
  const tests: test[] = [
    {
      name: 'one candi in range',
      in: [{ ranking: 1, name: 'a' }],
      out: [
        { ranking: 1, name: 'a' },
        { ranking: 2 },
        { ranking: 3 },
        { ranking: 4 },
        { ranking: 5 },
      ],
    },
    {
      name: 'two candi in range',
      in: [
        { ranking: 1, name: 'a' },
        { ranking: 2, name: 'b' },
      ],
      out: [
        { ranking: 1, name: 'a' },
        { ranking: 2, name: 'b' },
        { ranking: 3 },
        { ranking: 4 },
        { ranking: 5 },
      ],
    },
    {
      name: 'three seprated candi in range',
      in: [
        { ranking: 1, name: 'a' },
        { ranking: 2, name: 'b' },
        { ranking: 5, name: 'c' },
      ],
      out: [
        { ranking: 1, name: 'a' },
        { ranking: 2, name: 'b' },
        { ranking: 3 },
        { ranking: 4 },
        { ranking: 5, name: 'c' },
      ],
    },
    {
      name: 'two candi not in range',
      in: [
        { ranking: 2, name: 'a' },
        { ranking: 8, name: 'c' },
      ],
      out: [
        { ranking: 1 },
        { ranking: 2, name: 'a' },
        { ranking: 3 },
        { ranking: 4 },
        { ranking: 5 },
        { ranking: 8, name: 'c' },
      ],
    },
    {
      name: 'three candi not in range',
      in: [
        { ranking: 2, name: 'a' },
        { ranking: 8, name: 'b' },
        { ranking: 10, name: 'c' },
      ],
      out: [
        { ranking: 1 },
        { ranking: 2, name: 'a' },
        { ranking: 3 },
        { ranking: 4 },
        { ranking: 5 },
        { ranking: 8, name: 'b' },
        { ranking: 10, name: 'c' },
      ],
    },
  ];
  tests.forEach((tt) => {
    it(tt.name, () => {
      const got = expandBallotForEdit(tt.in);
      expect(got).toEqual(tt.out);
    });
  });
});

describe('compressBallotForSubmit', () => {
  interface test {
    name: string;
    in: Ballot;
    out: Ballot;
  }
  const tests: test[] = [
    {
      name: 'one candi in range',
      in: [
        { ranking: 1, name: 'a' },
        { ranking: 2 },
        { ranking: 3 },
        { ranking: 4 },
        { ranking: 5 },
      ],
      out: [{ ranking: 1, name: 'a' }],
    },
    {
      name: 'two candi in range',
      in: [
        { ranking: 1 },
        { ranking: 2, name: 'a' },
        { ranking: 3, name: 'b' },
        { ranking: 4 },
        { ranking: 5 },
      ],
      out: [
        { ranking: 2, name: 'a' },
        { ranking: 3, name: 'b' },
      ],
    },
    {
      name: 'three not orderd candi',
      in: [
        { ranking: 5, name: 'c' },
        { ranking: 1, name: 'a' },
        { ranking: 2, name: 'b' },
        { ranking: 3 },
        { ranking: 0, name: '' },
        { name: 'd' },
      ],
      out: [
        { ranking: 1, name: 'a' },
        { ranking: 2, name: 'b' },
        { ranking: 5, name: 'c' },
        { ranking: 6, name: 'd' },
      ],
    },
    {
      name: 'two candi not in range',
      in: [
        { ranking: 1 },
        { ranking: 8, name: 'c' },
        { ranking: 2, name: 'a' },
        { ranking: 3 },
        { ranking: 5 },
        { ranking: 4 },
      ],
      out: [
        { ranking: 2, name: 'a' },
        { ranking: 8, name: 'c' },
      ],
    },
    {
      name: 'three candi not in range',
      in: [
        { ranking: 1 },
        { ranking: 2, name: 'a' },
        { ranking: 3 },
        { ranking: 10, name: 'c' },
        { ranking: 8, name: 'b' },
        {},
        { ranking: 5 },
      ],
      out: [
        { ranking: 2, name: 'a' },
        { ranking: 8, name: 'b' },
        { ranking: 10, name: 'c' },
      ],
    },
  ];
  tests.forEach((tt) => {
    it(tt.name, () => {
      const got = compressBallotForSubmit(tt.in);
      expect(got).toEqual(tt.out);
    });
  });
});
