import { redirect } from '@sveltejs/kit';

export async function load({ parent, url }) {
  const pd = await parent();
  if (!pd.voter) {
    // not logged in
    redirect(302, `/auth?redirect=${encodeURIComponent(url.pathname)}`);
  }
  return { voter: pd.voter }; // covert { voter?: Voter } to { voter: Voter };
}
