import { Firestore, DocumentData, QueryDocumentSnapshot, Timestamp } from '@google-cloud/firestore';
import { Award, WorksSet, Ceremony } from '@service/entity';
import { NotFoundError } from '@service/errors';
import { Department } from '@service/value';

export const converter = <T extends DocumentData>() => ({
  toFirestore: (data: T): DocumentData => data,
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    return snap.data() as T;
  },
});

// PathPair: [collection, id]
export type PathPair = [string, string];

export async function getOne<T extends DocumentData>(db: Firestore, path: PathPair[]): Promise<T> {
  console.log(`get one at ${path.map((pair) => pair.join('.')).join('/')}`);
  let ref;
  for (const [collection, id] of path) {
    ref = (ref || db).collection(collection).doc(id);
  }
  const snapshot = await ref!.withConverter(converter<T>()).get();
  const data = snapshot.data();
  if (data === undefined) {
    throw NotFoundError(path.map((pair) => pair.join('.')));
  }
  return data as T;
}

export async function getAll<T extends DocumentData>(
  db: Firestore,
  path: PathPair[],
  collection: string,
): Promise<T[]> {
  console.log(`get all at ${path.map((pair) => pair.join('.')).join('/')}.${collection}`);
  let ref;
  for (const [collection, id] of path) {
    ref = (ref || db).collection(collection).doc(id);
  }
  const snapshot = await (ref || db).collection(collection).withConverter(converter<T>()).get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

export async function setOne<T extends DocumentData>(db: Firestore, path: PathPair[], data: T): Promise<void> {
  console.log(`set '${data}' at ${path.map((pair) => pair.join('.')).join('/')}`);
  let ref;
  for (const [collection, id] of path) {
    ref = (ref || db).collection(collection).doc(id);
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
  return new Ceremony(
    doc.year,
    doc.departments.map((dept) => dept as Department),
    doc.nomination_start_at.toDate(),
    doc.voting_start_at.toDate(),
    doc.award_start_at.toDate(),
  );
}

export interface WorkDoc {
  name: string;
  origin_name?: string;
  alias?: string[];
}

export interface DepartmentDoc {
  dept: string;
  works: WorkDoc[];
}

export function departmentDocToEntity(year: number, doc: DepartmentDoc): WorksSet {
  return new WorksSet(
    year,
    doc.dept as Department,
    doc.works.map((work) => ({
      name: work.name,
      originName: work.origin_name,
      alias: work.alias,
    })),
  );
}

export function departmentDocFromEntity(worksSet: WorksSet): DepartmentDoc {
  return {
    dept: worksSet.name,
    works: worksSet.works.map((work) => ({
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

export interface SessionDoc {
  name: string;
}

export interface BallotDoc {
  dept: string;
  voter: string;
  rankings: { ranking: number; work_name: string }[];
}

export interface AwardDoc {
  dept: string;
  rankings: { ranking: number; work: WorkDoc }[];
}

export function awardDocFromEntity(award: Award): AwardDoc {
  return {
    dept: award.department,
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

export function awardDocToEntity(data: AwardDoc, year: number): Award {
  return {
    year,
    department: data.dept as Department,
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
