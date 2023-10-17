export type ErrorCode =
  | "BAD_REQUEST" // 400
  | "NOT_FOUND" // 404
  | "UNAUTHORIZED" // 401
  | "FORBIDDEN" // 403
  | "INTERNAL_SERVER_ERROR"; // 500

export class Terror extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }

  handleError(error: unknown): Terror {
    if (error instanceof Terror) {
      return error;
    } else {
      return new Terror(
        "INTERNAL_SERVER_ERROR",
        `Unexpected Internal Error: ${error}`,
      );
    }
  }
}

export function NoDepartmentError(department: string) {
  return new Terror("NOT_FOUND", `No such department: ${department}`);
}

export function NotInStageError(stage: string) {
  return new Terror(
    "FORBIDDEN",
    `This page is not available during the ${stage} stage`,
  );
}

export function NoSessionIDError() {
  return new Terror("UNAUTHORIZED", "No sessionid");
}

export function InvalidPinCodeError() {
  return new Terror("BAD_REQUEST", "Invalid pin code");
}

export function WorkNotFoundError(name: string) {
  return new Terror("NOT_FOUND", `No such work: ${name}`);
}
