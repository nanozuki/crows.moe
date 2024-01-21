export const enum ErrorCode {
  BadRequest = 'BAD_REQUEST', // 400
  NotFound = 'NOT_FOUND', // 404
  Unauthorized = 'UNAUTHORIZED', // 401
  Forbidden = 'FORBIDDEN', // 403
  InternalServerError = 'INTERNAL_SERVER_ERROR', // 500
}

export class Terror extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }

  static handleError(error: unknown): Terror {
    if (error instanceof Terror) {
      return error;
    } else {
      return new Terror(ErrorCode.InternalServerError, `Unexpected Internal Error: ${error}`);
    }
  }
}

export function NoDepartmentError(department: string) {
  return new Terror(ErrorCode.NotFound, `No such department: ${department}`);
}

export function NotInStageError(...stages: string[]) {
  return new Terror(ErrorCode.Forbidden, `This page is not available during the '${stages.join(', ')}‘ stage`);
}

export function NoTokenError() {
  return new Terror(ErrorCode.Unauthorized, 'No valid token');
}

export function InvalidPinCodeError() {
  return new Terror(ErrorCode.BadRequest, 'Invalid pin code');
}

export function WorkNotFoundError(name: string) {
  return new Terror(ErrorCode.NotFound, `No such work: ${name}`);
}

export function NotFoundError(path: string[]) {
  return new Terror(ErrorCode.NotFound, `Not found in ${path.join('.')}`);
}

export function InternalError(message: string) {
  return new Terror(ErrorCode.InternalServerError, message);
}

export function InvalidDatabasePathError(path: string[]) {
  return new Terror(ErrorCode.InternalServerError, `Invalid database path: ${path.join('.')}`);
}
