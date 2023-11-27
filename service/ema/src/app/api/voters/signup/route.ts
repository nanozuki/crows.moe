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
  const { voter, sessionId, pinCode } = await service.signUpVoter(req.name);
  const res = NextResponse.json<SignUpResponse>({ name: voter.name, pinCode: pinCode });
  res.cookies.set('sessionid', sessionId, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
  return res;
}
