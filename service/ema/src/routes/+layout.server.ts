import { getService } from '$lib/server';

export async function load({ cookies }) {
  const service = getService();
  const [ceremonies, voter, invited] = await Promise.all([
    service.getCeremonies(),
    service.getVoterToken(cookies),
    service.getInvitedToken(cookies),
  ]);
  return {
    now: new Date(),
    ceremonies,
    voter,
    invited,
  };
}
