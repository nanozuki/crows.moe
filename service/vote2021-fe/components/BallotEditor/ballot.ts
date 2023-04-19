export type Ballot = Candidate[];

export interface Candidate {
  name?: string;
  ranking?: number;
}

const minEditCandidates = 5;

const expandBallotForEdit = (prev: Ballot): Ballot => {
  let p: number = 0;
  let next: Candidate[] = [];
  for (let i = 1; i <= minEditCandidates; i++) {
    if ((prev[p]?.ranking || 0) !== i) {
      next.push({ ranking: i });
      continue;
    }
    while (p < prev.length && (prev[p].ranking || 0) === i) {
      next.push(prev[p]);
      p += 1;
    }
  }
  next.push(...prev.slice(p));
  return next;
};

const compressBallotForSubmit = (prev: Ballot): Ballot => {
  return prev
    .map((c, i) => {
      if ((c.name || '') !== '' && !c.ranking) {
        c.ranking = i + 1;
      }
      return c;
    })
    .filter((c) => (c.name || '') !== '')
    .sort((a, b) => (a.ranking || 0) - (b.ranking || 0));
};

const ballotSetRanking = (
  prev: Ballot,
  index: number,
  ranking: number
): Ballot => {
  const next = [...prev];
  next[index].ranking = ranking;
  return next;
};

const ballotSetName = (prev: Ballot, index: number, name: string): Ballot => {
  const next = [...prev];
  next[index].name = name;
  return next;
};

const ballotAddLine = (prev: Ballot): Ballot => {
  return [...prev, { ranking: prev.length + 1 }];
};

export {
  expandBallotForEdit,
  compressBallotForSubmit,
  ballotSetRanking,
  ballotSetName,
  ballotAddLine,
};
