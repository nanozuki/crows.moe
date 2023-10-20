import { Ballot } from '@service/entity';
import { service } from '@service/init';
import { Department, RankedWorkName } from '@service/value';

export interface EditBallotRequest {
  year: number;
  department: Department;
  rankings: RankedWorkName[];
}

export interface EditBallotResponse {
  ballot: Ballot;
}

export async function POST(request: Request) {
  const req = (await request.json()) as EditBallotRequest;
  const ballot = await service.editBallot(req.year, req.department, req.rankings);
  const res: EditBallotResponse = { ballot };
  return Response.json(res);
}
