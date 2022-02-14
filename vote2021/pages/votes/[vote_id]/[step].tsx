import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const VoteStep: NextPage = () => {
  const router = useRouter();
  const { vote_id, step } = router.query;
  return (
    <div>
      <p>VoteID: {vote_id}</p>
      <p>Step: {step}</p>
    </div>
  );
};

export default VoteStep;
