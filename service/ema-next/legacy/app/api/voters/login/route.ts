import { getService } from '@service/init';
import { NextResponse } from 'next/server';

export interface LoginRequest {
  name: string;
  pinCode: string;
}

export interface LoginResponse {
  name: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const service = await getService();
  const req = (await request.json()) as LoginRequest;

  const [voter, cookie] = await service.logInVoter(req.name, req.pinCode);

  const res = NextResponse.json<LoginResponse>({ name: voter.name });
  res.cookies.set(cookie);
  return res;
}
