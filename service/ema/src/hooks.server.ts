import { AppError, Err } from '$lib/domain/errors';
import type { HandleServerError } from '@sveltejs/kit';
import { match, P } from 'ts-pattern';

export const handleError: HandleServerError = async ({ error }) => {
  return match(error)
    .with(P.instanceOf(Error), (err) => {
      console.error(err.stack);
      return Err.Unknown(err).toError();
    })
    .with(P.instanceOf(AppError), (err) => err.toError())
    .otherwise(() => Err.Unknown(error).toError());
};
