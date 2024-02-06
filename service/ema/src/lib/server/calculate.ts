import { Err } from '$lib/domain/errors';
import type { RankCalculator, RankResultItem, VoteItem } from './adapter';

interface Request {
  payload: {
    id: string;
    votes: {
      id: number;
      ranking: number;
    }[];
  }[];
}

type Response = number[][];

const apiUrl = 'https://schwartz.fubuki.me';

// Send post to apiUrl, using the Request as json body, reveive json like Response.
export async function calculate(items: VoteItem[]): Promise<RankResultItem[]> {
  const req: Request = { payload: [] };
  for (const item of items) {
    let found = false;
    for (const p of req.payload) {
      if (p.id === item.voteId.toString()) {
        found = true;
        p.votes.push({ id: item.workId, ranking: item.ranking });
        break;
      }
    }
    if (!found) {
      req.payload.push({ id: item.voteId.toString(), votes: [{ id: item.workId, ranking: item.ranking }] });
    }
  }
  const res = await Err.catch(
    async () => {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });
      return (await res.json()) as Response;
    },
    (err) => Err.Internal('do calculate api', err),
  );
  const results: RankResultItem[] = [];
  for (let i = 0; i < res.length; i++) {
    for (const workId of res[i]) {
      results.push({ workId, ranking: i + 1 });
    }
  }
  return results;
}

export const calculator = { calculate } satisfies RankCalculator;
