import Firestore from "@google-cloud/firestore";

type Data = Firestore.DocumentData;
export type DocMaker<Model extends Data, Doc extends Document<Model>> = (
  base: BaseDoc<Model>
) => Doc;

export class Root {
  client: Firestore.Firestore;
  constructor(projectId: string) {
    this.client = new Firestore.Firestore({ projectId });
  }

  public collection<Model extends Data, Doc extends Document<Model>>(
    path: string,
    docMaker: DocMaker<Model, Doc>
  ): Collection<Model, Doc> {
    const ref = this.client.collection(
      path
    ) as Firestore.CollectionReference<Model>;
    return new Collection(ref, docMaker);
  }
}

export class Collection<Model extends Data, Doc extends Document<Model>> {
  constructor(
    public ref: Firestore.CollectionReference<Model>,
    public maker: DocMaker<Model, Doc>
  ) {}

  doc(id: string): Doc {
    const doc = this.ref.doc(id) as Firestore.DocumentReference<Model>;
    return this.maker(new BaseDoc(doc));
  }

  async getAll(): Promise<Model[]> {
    const snapshot = await this.ref.get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      if (!data) {
        throw new Error("Document not found");
      }
      return data;
    });
  }
}

export interface Document<Model extends Data> {
  get(): Promise<Model>;
  set(data: Model): Promise<void>;
  collection<SubModel extends Data, SubDoc extends Document<SubModel>>(
    path: string,
    maker: DocMaker<SubModel, SubDoc>
  ): Collection<SubModel, SubDoc>;
}

export class BaseDoc<Model extends Data> implements Document<Model> {
  constructor(public ref: Firestore.DocumentReference<Model>) {}

  public async get(): Promise<Model> {
    const doc = await this.ref.get();
    const data = doc.data();
    if (!data) {
      throw new Error("Document not found");
    }
    return data;
  }

  public async set(data: Model): Promise<void> {
    await this.ref.set(data);
  }

  public collection<SubModel extends Data, SubDoc extends Document<SubModel>>(
    path: string,
    maker: DocMaker<SubModel, SubDoc>
  ): Collection<SubModel, SubDoc> {
    const ref = this.ref.collection(
      path
    ) as Firestore.CollectionReference<SubModel>;
    return new Collection(ref, maker);
  }
}

/* example
import {
  Award,
  Ballot,
  Department,
  Session,
  Voter,
  Year,
} from '@app/lib/models';
import { BaseDoc, Collection, Root } from './storm';

const col = {
  years: 'mediavote_years',
  departments: 'departments',
  voters: 'voters',
  sessions: 'sessions',
  ballots: 'ballots',
  awards: 'awards',
};

export class Store {
  private root: Root;
  constructor(projectId: string) {
    this.root = new Root(projectId);
  }

  years(): Collection<Year, YearDoc> {
    return this.root.collection(
      col.years,
      (base): YearDoc => new YearDoc(base)
    );
  }
}

class YearDoc extends BaseDoc<Year> {
  constructor(base: BaseDoc<Year>) {
    super(base.ref);
  }

  departments(): Collection<Department, BaseDoc<Department>> {
    return this.collection(col.departments, (base) => base);
  }

  voters(): Collection<Voter, BaseDoc<Voter>> {
    return this.collection(col.voters, (base) => base);
  }

  sessions(): Collection<Session, BaseDoc<Session>> {
    return this.collection('sessions', (base) => base);
  }

  ballots(): Collection<Ballot, BaseDoc<Ballot>> {
    return this.collection('ballots', (base) => base);
  }

  awards(): Collection<Award, BaseDoc<Award>> {
    return this.collection('awards', (base) => base);
  }
}
*/
