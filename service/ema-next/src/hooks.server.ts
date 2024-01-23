import { AppError, Err } from '$lib/domain/errors';
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error }) => {
  console.error((error as Error).stack);
  if (error instanceof AppError) {
    return error;
  } else {
    return Err.Unknown(error);
  }
};
