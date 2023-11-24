import { AddNominationsRequest, AddNominationsResponse } from '@app/api/nominations/add/route';
import { SignUpRequest, SignUpResponse } from '@app/api/voters/signup/route';
import { LoginRequest, LoginResponse } from '@app/api/voters/login/route';
import { EditBallotRequest, EditBallotResponse } from '@app/api/ballots/edit/route';
import { Terror } from '@service/errors';

async function post<Req, Res>(endpoint: string, req: Req): Promise<Res> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    const err: Terror = await response.json(); // TODO: handle error
    throw Error(err.message ? `${err.code}: ${err.message}` : err.code);
  }
  return response.json();
}

export async function addNomination(arg: AddNominationsRequest): Promise<AddNominationsResponse> {
  return post('/api/nominations/add', arg);
}

export async function voterSignUp(arg: SignUpRequest): Promise<SignUpResponse> {
  return post('/api/voters/signup', arg);
}

export async function loginVoter(arg: LoginRequest): Promise<LoginResponse> {
  return post('/api/voters/login', arg);
}

export async function editBallot(arg: EditBallotRequest): Promise<EditBallotResponse> {
  return post('/api/ballots/edit', arg);
}
