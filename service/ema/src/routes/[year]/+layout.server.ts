import type { Ceremony } from '$lib/domain/entity';
import { Err } from '$lib/domain/errors';

export async function load({ params, parent }) {
  const year = parseInt(params.year);
  if (isNaN(year)) {
    throw Err.Invalid('year', params.year);
  }
  const parentData = await parent();
  const ceremony = parentData.ceremonies.find((c) => c.year === year);
  if (!ceremony) {
    throw Err.NotFound('ceremony', year);
  }
  return { ceremony } as { ceremony: Ceremony }; // Let TypeScript infer the type
}
