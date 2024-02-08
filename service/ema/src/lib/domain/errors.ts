import { error, type HttpError } from '@sveltejs/kit';
import { match, P } from 'ts-pattern';

function Database(operation: string, err: Error): HttpError {
  const he = error(500, {
    title: '数据库错误',
    message: `Database error ${operation}: ${err.message}`,
    stack: err.stack,
  });
  return he;
}

function Internal(operation: string, err: Error): HttpError {
  return error(500, {
    title: '内部错误',
    message: `Internal error when ${operation}: ${err.message} `,
    stack: err.stack,
  });
}

function Unknown(err: unknown): HttpError {
  if (err instanceof Error) {
    return error(500, {
      title: '未知错误',
      message: `Unknown error: ${err.message}`,
      stack: err.stack,
    });
  } else {
    return error(500, {
      title: '未知错误',
      message: `Unknown error: ${JSON.stringify(err)}`,
    });
  }
}

function NotFound(object: string, ...keys: unknown[]): HttpError {
  const key = keys.map((k) => JSON.stringify(k)).join('.');
  return error(404, { title: '找不到内容', message: `${object}(${key}) not found` });
}

function Invalid(type: string, value: unknown): HttpError {
  return error(400, { title: '参数错误', message: `Invalid ${type}: ${JSON.stringify(value)}` });
}

async function catch_<T>(fn: () => T | Promise<T>, handler: (e: Error) => HttpError): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === '') {
        e.message = JSON.stringify(e);
      }
      throw handler(e);
    }
    throw e;
  }
}

type Result<T> = { ok: true; value: T } | { ok: false; error: HttpError };

export const httpErrorPattern = {
  status: P.number,
  body: {
    title: P.string,
    message: P.string,
  },
};

async function match_<T>(fn: () => T | Promise<T>) {
  let result: Result<T>;
  try {
    result = { ok: true, value: await fn() };
  } catch (e) {
    result = match(e)
      .returnType<Result<T>>()
      .with(httpErrorPattern, (value) => {
        return { ok: false, error: value as HttpError };
      })
      .otherwise(() => {
        throw e;
      });
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
