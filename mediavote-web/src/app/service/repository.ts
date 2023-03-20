import { Firestore } from '@google-cloud/firestore';
import { Department, idOfYear, Work, Year } from './entity';

const db = new Firestore({ projectId: 'crows-moe' });

/*
  [MediaVote_Year] - store yearly time infos
    -> [Department] -> {dept -> works[]}
    -> [Voter] -> {name -> {name, pinCode}}
    -> [Session] {key -> user}
    -> [Ballot] {dept -> rankings}
    -> [Awards] {dept -> rankings}
*/

interface DepartmentDoc {
  dept: Department;
  works: Work[];
}

export async function getYears(): Promise<Year[]> {
  const snap = await db.collection('years').get();
  const years: Year[] = [];
  snap.forEach((doc) => years.push(doc.data() as Year));
  return years;
}

export async function getCurrent(): Promise<Year> {
  const snap = await db
    .collection('years')
    .orderBy('year', 'desc')
    .limit(1)
    .get();
  if (snap.size == 0) {
    throw Error('Not Found');
  }
  const years: Year[] = [];
  snap.forEach((doc) => years.push(doc.data() as Year));
  return years[0];
}

export async function addWork(dept: Department, name: string): Promise<void> {
  const year = await getCurrent();
  const deptRef = db
    .collection('years')
    .doc(idOfYear(year))
    .collection('departments')
    .doc(dept);
  const doc = await deptRef.get();

  if (!doc.exists) {
    const deptDoc = { dept, works: [{ name }] };
    await deptRef.set(deptDoc);
    return;
  }
  const deptDoc = doc.data() as DepartmentDoc;
  const found = deptDoc.works.findIndex((work) => {
    return (
      work.name == name ||
      (work.alias || []).findIndex((alias) => alias == name) > -1
    );
  });
  if (!found) {
    deptDoc.works.push({ name });
    await deptRef.update({ works: deptDoc.works });
  }
}

export async function getWorks(dept: Department): Promise<Work[]> {
  const year = await getCurrent();
  const deptRef = db
    .collection('years')
    .doc(idOfYear(year))
    .collection('departments')
    .doc(dept);
  const doc = await deptRef.get();
  if (!doc.exists) {
    return [];
  }
  return (doc.data() as DepartmentDoc).works;
}
