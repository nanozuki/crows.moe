import type { Ceremony } from '$lib/domain/entity';
import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
  const year = parseInt(params.year);
  if (isNaN(year)) {
    throw error(404);
  }
  const parentData = await parent();
  const ceremony = parentData.ceremonies.find((c) => c.year === year);
  if (!ceremony) {
    throw error(404);
  }
  return { ceremony } satisfies { ceremony: Ceremony };
}
