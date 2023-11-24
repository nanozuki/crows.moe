import { getService } from '@service/init';
import { NextResponse } from 'next/server';

export interface SignUpRequest {
  name: string;
}

export interface SignUpResponse {
  name: string;
  pinCode: string;
}

export async function POST(request: Request): Promise<Response> {
  const req = (await request.json()) as SignUpRequest;
  const service = await getService();
  const [voter, sessionid] = await service.signUpVoter(req.name);
  const res = NextResponse.json<SignUpResponse>({ name: voter.name, pinCode: voter.pinCode });
  res.cookies.set('sessionid', sessionid, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
  return res;
}
