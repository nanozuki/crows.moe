import { getService } from '$lib/server';

export async function load({ cookies }) {
  const service = getService();
  const [ceremonies, voter, invited] = await Promise.all([
    service.getCeremonies(),
    service.verifyToken(cookies),
    service.verifyInvited(cookies),
  ]);
  return {
    now: new Date(),
    ceremonies,
    voter,
    invited,
  };
}
