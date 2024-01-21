import { Firestore, DocumentData, QueryDocumentSnapshot, Timestamp } from '@google-cloud/firestore';
import { Award, WorksSet, Ceremony, Ballot } from '@service/entity';
import { NotFoundError } from '@service/errors';
import { Department, Work } from '@service/value';

export const converter = <T extends DocumentData>() => ({
  toFirestore: (data: T): DocumentData => data,
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    return snap.data() as T;
  },
});

// PathPair: [collection, id]
export type PathPair = [string, string];

export async function getOne<T extends DocumentData>(db: Firestore, ...path: string[]): Promise<T> {
  if (path.length % 2 !== 0) {
    throw new Error(`Invalid path for getOne: ${path.join('.')}`);
  }
  console.log(`get one at ${path.join('.')}`);
  let ref;
  for (let i = 0; i * 2 + 1 < path.length; i++) {
    ref = (ref || db).collection(path[i * 2]).doc(path[i * 2 + 1]);
  }
  const snapshot = await ref!.withConverter(converter<T>()).get();
  const data = snapshot.data();
  if (data === undefined) {
    throw NotFoundError(path);
  }
  return data as T;
}

export async function getAll<T extends DocumentData>(db: Firestore, ...path: string[]): Promise<T[]> {
  if (path.length % 2 !== 1) {
    throw new Error(`Invalid path for getAll: ${path.join('.')}`);
  }
  console.log(`get all at ${path.join('.')}`);
  let ref;
  for (let i = 0; i * 2 + 1 < path.length; i++) {
    ref = (ref || db).collection(path[i * 2]).doc(path[i * 2 + 1]);
  }
  const snapshot = await (ref || db)
    .collection(path[path.length - 1])
    .withConverter(converter<T>())
    .get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

export async function setOne<T extends DocumentData>(db: Firestore, data: T, ...path: string[]): Promise<void> {
  console.log(`set '${JSON.stringify(data)}' at ${path.join('.')}`);
  let ref;
  for (let i = 0; i * 2 + 1 < path.length; i++) {
    ref = (ref || db).collection(path[i * 2]).doc(path[i * 2 + 1]);
  }
  await ref!.withConverter(converter<T>()).set(data);
}

export interface YearDoc {
  year: number;
  nomination_start_at: Timestamp;
  voting_start_at: Timestamp;
  award_start_at: Timestamp;
  departments: string[];
}

export function yearDocToEntity(doc: YearDoc): Ceremony {
  return {
    year: doc.year,
    departments: doc.departments.map((dept) => dept as Department),
    nominationStartAt: doc.nomination_start_at.toDate(),
    votingStartAt: doc.voting_start_at.toDate(),
    awardStartAt: doc.award_start_at.toDate(),
  };
}

export interface WorkDoc {
  name: string;
  origin_name?: string;
  alias?: string[];
}

export interface DepartmentDoc {
  works: WorkDoc[];
}

export function departmentDocToEntity(doc: DepartmentDoc): WorksSet {
  return doc.works.map((work) => ({
    name: work.name,
    originName: work.origin_name,
    alias: work.alias,
  }));
}

export function departmentDocFromEntity(worksSet: WorksSet): DepartmentDoc {
  return {
    works: worksSet.map((work) => ({
      name: work.name,
      origin_name: work.originName,
      alias: work.alias,
    })),
  };
}

export interface VoterDoc {
  name: string;
  pin_code: string;
}

export interface BallotDoc {
  voter: string;
  rankings: { ranking: number; work_name: string }[];
}

export function ballotDocToEntity(data: BallotDoc, dept: DepartmentDoc): Ballot {
  const set = departmentDocToEntity(dept);
  return {
    voter: { name: data.voter },
    rankings: data.rankings.map((rankedWork) => ({
      ranking: rankedWork.ranking,
      work: set.find((work) => work.name === rankedWork.work_name) as Work,
    })),
  };
}

export function ballotDocFromEntity(ballot: Ballot): BallotDoc {
  return {
    voter: ballot.voter.name,
    rankings: ballot.rankings.map((rankedWork) => ({
      ranking: rankedWork.ranking,
      work_name: rankedWork.work.name,
    })),
  };
}

export interface AwardDoc {
  rankings: { ranking: number; work: WorkDoc }[];
}

export function awardDocFromEntity(award: Award): AwardDoc {
  return {
    rankings: award.rankings.map((rankedWork) => ({
      ranking: rankedWork.ranking,
      work: {
        name: rankedWork.work.name,
        origin_name: rankedWork.work.originName,
        alias: rankedWork.work.alias,
      },
    })),
  };
}

export function awardDocToEntity(data: AwardDoc): Award {
  return {
    rankings: data.rankings.map((rankedWork) => ({
      ranking: rankedWork.ranking,
      work: {
        name: rankedWork.work.name,
        originName: rankedWork.work.origin_name,
        alias: rankedWork.work.alias,
      },
    })),
  };
}
