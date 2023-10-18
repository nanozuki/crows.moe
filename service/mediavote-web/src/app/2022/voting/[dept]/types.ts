import { Ballot, Work } from '@app/lib/models';

export const enum SheetState {
  Editing = 'editing',
  Viewing = 'viewing',
}

export interface BallotItem {
  ranking?: number;
  work: Work;
}

export function makeBallotItems(nominations: Work[], ballot: Ballot): BallotItem[] {
  const items: BallotItem[] = nominations.map((work) => {
    const rankingItem = ballot.rankings?.find((item) => item.work_name === work.name);
    if (rankingItem) {
      return { ranking: rankingItem.ranking, work };
    } else {
      return { work };
    }
  });
  sortBallotItems(items);
  return items;
}

export function sortBallotItems(items: BallotItem[]) {
  items.sort((a, b) => {
    return (a.ranking || Infinity) - (b.ranking || Infinity);
  });
}

export function makeBallot(items: BallotItem[]): Ballot {
  const rankings = items
    .filter((item) => item.ranking)
    .map((item) => ({
      ranking: item.ranking as number,
      work_name: item.work.name,
    }))
    .sort((a, b) => a.ranking - b.ranking);
  return { rankings };
}
