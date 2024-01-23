import { error } from '@sveltejs/kit';
import { match } from 'ts-pattern';

export const enum ErrorCode {
  DatabaseError = 'DatabaseError',
  InternalError = 'InternalError',
  UnknownError = 'UnknownError',
  NotFound = 'NotFound',
  InvalidParameter = 'InvalidParameter',
}

export interface ErrorInfo {
  statusCode: number;
  title: string;
}

export const errors: Record<ErrorCode, ErrorInfo> = {
  DatabaseError: { statusCode: 500, title: '数据库错误' },
  InternalError: { statusCode: 500, title: '内部错误' },
  UnknownError: { statusCode: 500, title: '未知错误' },
  NotFound: { statusCode: 404, title: '找不到内容' },
  InvalidParameter: { statusCode: 400, title: '参数错误' },
};

export class AppError extends Error {
  public title: string;
  public cause?: string;

  constructor(
    public code: ErrorCode,
    public message: string,
    cause?: unknown,
  ) {
    super(message);
    this.title = errors[code].title;
    this.cause = cause ? JSON.stringify(cause) : undefined;
  }

  toSvelteKit() {
    const { title } = errors[this.code];
    const { message } = this;
    const cause = this.cause ? JSON.stringify(this.cause) : undefined;
    return { title, message, cause };
  }

  throwToSvelteKit() {
    const { statusCode, title } = errors[this.code];
    const { message } = this;
    const cause = this.cause ? JSON.stringify(this.cause) : undefined;
    const e: App.Error = { title, message, cause };
    throw error(statusCode, e);
  }
}

function Database(operation: string, cause: Error): AppError {
  return new AppError(ErrorCode.DatabaseError, `Database error when ${operation}`, cause);
}

function Internal(operation: string, cause: Error): AppError {
  return new AppError(ErrorCode.InternalError, `Internal error when ${operation}`, cause);
}

function Unknown(error: unknown): AppError {
  if (error instanceof Error) {
    return new AppError(ErrorCode.UnknownError, error.message, error);
  }
  return new AppError(ErrorCode.UnknownError, 'UnknownError', error);
}

function NotFound(object: string, ...keys: string[]): AppError {
  return new AppError(ErrorCode.NotFound, `${object}(${keys.join('.')}) not found`);
}

function Invalid(type: string, value: unknown): AppError {
  return new AppError(ErrorCode.InvalidParameter, `Invalid ${type}: ${JSON.stringify(value)}`);
}

async function catch_<T>(fn: () => T | Promise<T>, eh: (e: Error) => AppError): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Error) {
      throw eh(e);
    }
    throw e;
  }
}

type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };

async function match_<T>(fn: () => T | Promise<T>) {
  let result: Result<T>;
  try {
    result = { ok: true, value: await fn() };
  } catch (e) {
    if (e instanceof AppError) {
      result = { ok: false, error: e };
    }
    throw e;
  }
  return match<Result<T>>(result);
}

export const Err = {
  Database,
  Internal,
  Unknown,
  NotFound,
  Invalid,
  catch: catch_,
  match: match_,
};
