import { service } from '@service/init';
import { Department, Work } from '@service/value';

export interface AddNominationsRequest {
  year: number;
  department: Department;
  workName: string;
}

export interface AddNominationsResponse {
  works: Work[];
}

export async function POST(request: Request) {
  const req = (await request.json()) as AddNominationsRequest;
  const works = await service.addNomination(req.year, req.department, req.workName);
  // TODO: error handle
  const res: AddNominationsResponse = { works };
  return Response.json(res);
}
