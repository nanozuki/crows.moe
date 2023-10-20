import { service } from '@service/init';
import { NextResponse } from 'next/server';

export interface LoginRequest {
  name: string;
  pinCode: string;
}

export interface LoginResponse {
  name: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const req = (await request.json()) as LoginRequest;
  const [voter, sessionid] = await service.logInVoter(req.name, req.pinCode);
  const res = NextResponse.json<LoginResponse>({ name: voter.name });
  res.cookies.set('sessionid', sessionid, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
  return res;
}
