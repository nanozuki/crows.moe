import {  useState, useEffect, useCallback } from 'react';
import {
  expandBallotForEdit,
  Candidate,
  Ballot,
} from './ballot';

interface BallotEditor {
  voteID: string;
  department: number;
}

const BallotEditor = ({
  voteID,
  department,
}: BallotEditor) => {
  const [ballot, setBallot] = useState<Ballot>([]);
  const [loaded, setLoaded] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const updateEdit = useCallback(
    (ballot: Ballot): Ballot => {
        const next = expandBallotForEdit(ballot);
      setBallot(next);
      return next;
    },
    [],
  );
  useEffect(() => {
    (async function () {
      const res = await fetch(`/api/vote/${voteID}/${department}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const data: { candidates: Candidate[] } = await res.json();
      setLoaded(true);
      updateEdit( data.candidates);
    })();
    return function cleanup() {
      updateEdit([]);
      setLoaded(false);
      setErrMessage('');
    };
  }, [department, updateEdit, voteID]);

  let items: React.ReactNode[] = [];
  if (loaded) {
    ballot.forEach((c, index) => {
      items.push(
        <p key={`ranking-${index}`}>{c.ranking?.toString()}</p>,
        <p key={`workname-${index}`}>{c.name || ''}</p>
      );
    });
  }
  return (
    <section className="bg-overlay p-4 mt-8 mb-8 -ml-4 -mr-4 sm:ml-0 sm:mr-0">
      <p className="text-2xl font-bold font-serif leading-loose border-b-2 border-solid border-iris mb-4">
        投票
      </p>
      {loaded || <p className="text-muted mt-4 mb-4">加载中...</p>}
      {loaded && (
        <>
          <form className="grid grid-cols-vote gap-2">
            <p className="leading-none text-iris">排名</p>
            <p className="leading-none text-iris">作品名</p>
            {items}
          </form>
          {errMessage && (
            <p key="err-message" className="text-love">
              {errMessage}
            </p>
          )}
        </>
      )}
    </section>
  );
};

export { BallotEditor };
