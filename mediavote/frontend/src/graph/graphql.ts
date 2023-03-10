/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Ballot = {
  __typename?: 'Ballot';
  candidates: Array<WorkRanking>;
  department: Department;
  id: Scalars['ID'];
  voterID: Scalars['ID'];
};

export type BallotInput = {
  candidates: Array<WorkRankingInput>;
  department: Department;
};

export enum Department {
  Game = 'Game',
  Manga = 'Manga',
  NonTvAnime = 'NonTVAnime',
  Novel = 'Novel',
  TvAnime = 'TVAnime'
}

export type Mutation = {
  __typename?: 'Mutation';
  postBallot?: Maybe<Ballot>;
  postNomination?: Maybe<Array<Nomination>>;
};


export type MutationPostBallotArgs = {
  input: BallotInput;
};


export type MutationPostNominationArgs = {
  department: Department;
  work: Scalars['String'];
};

export type Nomination = {
  __typename?: 'Nomination';
  department: Department;
  id: Scalars['ID'];
  work?: Maybe<Work>;
  workID?: Maybe<Scalars['ID']>;
  workName: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  nominations?: Maybe<Array<Nomination>>;
  ranking?: Maybe<Ranking>;
  rankings?: Maybe<Array<Ranking>>;
  voter?: Maybe<Voter>;
  works?: Maybe<Array<Work>>;
};


export type QueryNominationsArgs = {
  department?: InputMaybe<Department>;
};


export type QueryRankingArgs = {
  department: Department;
};


export type QueryWorksArgs = {
  department?: InputMaybe<Department>;
};

export type Ranking = {
  __typename?: 'Ranking';
  department: Department;
  rankings?: Maybe<Array<WorkRanking>>;
};

export type Voter = {
  __typename?: 'Voter';
  ballot?: Maybe<Ballot>;
  id: Scalars['ID'];
  name: Scalars['String'];
  nominations?: Maybe<Array<Nomination>>;
};


export type VoterBallotArgs = {
  department: Department;
};


export type VoterNominationsArgs = {
  department: Department;
};

export type Work = {
  __typename?: 'Work';
  alias?: Maybe<Array<Scalars['String']>>;
  department: Department;
  id: Scalars['ID'];
  nameCN: Scalars['String'];
  nameOrigin: Scalars['String'];
};

export type WorkRanking = {
  __typename?: 'WorkRanking';
  Ranking: Scalars['Int'];
  Work?: Maybe<Work>;
  WorkID: Scalars['ID'];
};

export type WorkRankingInput = {
  Ranking: Scalars['Int'];
  WorkID: Scalars['ID'];
};
