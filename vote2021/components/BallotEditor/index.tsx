import { useTextField } from '@react-aria/textfield';
import { FormEvent, useRef, useState, useEffect, useCallback } from 'react';
import {
  ballotAddLine,
  ballotSetName,
  ballotSetRanking,
  expandBallotForEdit,
  Candidate,
  Ballot,
  compressBallotForSubmit,
} from './ballot';

interface RankingInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RankingInput = (props: RankingInputProps) => {
  let ref = useRef<HTMLInputElement>(null);
  let { inputProps } = useTextField(props, ref);
  return (
    <div>
      <input
        {...inputProps}
        className="block w-full text-center"
        type="number"
        min={1}
        aria-label={props.label}
        ref={ref}
      />
    </div>
  );
};

interface NameInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}

const NameInput = (props: NameInputProps) => {
  let ref = useRef<HTMLInputElement>(null);
  let { inputProps } = useTextField(props, ref);
  return (
    <div>
      <input
        {...inputProps}
        className="w-full pl-1 pr-1"
        aria-label={props.label}
        ref={ref}
      />
    </div>
  );
};

interface BallotEditor {
  voteID: string;
  department: number;
  setEdit: (edit: boolean) => void;
}

const BallotEditor = ({
  voteID,
  department,
  setEdit: setPropEdit,
}: BallotEditor) => {
  const [ballot, setBallot] = useState<Ballot>([]);
  const [edit, setEdit] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const updateEdit = useCallback(
    (edit: boolean, ballot: Ballot): Ballot => {
      setEdit(edit);
      setPropEdit(edit);
      let next: Ballot;
      if (edit) {
        next = expandBallotForEdit(ballot);
      } else {
        next = compressBallotForSubmit(ballot);
      }
      setBallot(next);
      return next;
    },
    [setPropEdit]
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
      updateEdit(data.candidates.length === 0, data.candidates);
    })();
    return function cleanup() {
      updateEdit(false, []);
      setLoaded(false);
      setErrMessage('');
    };
  }, [department, updateEdit, voteID]);

  const submit = async () => {
    const compressed = updateEdit(false, ballot);
    const res = await fetch(`/api/vote/${voteID}/${department}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vote_id: voteID,
        department,
        candidates: compressed,
      }),
    });
    if (!res.ok) {
      setErrMessage('提交投票失败');
    } else {
      setErrMessage('');
    }
  };
  const toEdit = () => {
    updateEdit(true, ballot);
  };

  let items: React.ReactNode[] = [];
  if (loaded && edit) {
    ballot.forEach((c, index) => {
      items.push(
        <RankingInput
          key={`ranking-${index}`}
          label={`ranking-${index}`}
          value={c.ranking?.toString()}
          onChange={(value: string) => {
            setBallot(ballotSetRanking(ballot, index, parseInt(value)));
          }}
        />,
        <NameInput
          key={`workname-${index}`}
          label={`workname-${index}`}
          value={c.name || ''}
          onChange={(value: string) => {
            setBallot(ballotSetName(ballot, index, value));
          }}
        />
      );
    });
  } else if (loaded && !edit) {
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
          {edit && (
            <button
              key="add-line-btn"
              className="border-solid border-1 border-text block w-full text-center leading-7 mt-2"
              onClick={(e: FormEvent) => {
                e.preventDefault();
                setBallot(ballotAddLine(ballot));
              }}
            >
              +
            </button>
          )}
          <button
            className="bg-iris text-base block w-full text-center leading-7 mt-4"
            key="submit-btn"
            onClick={(e: FormEvent) => {
              e.preventDefault();
              edit ? submit() : toEdit();
            }}
          >
            {edit ? '确认' : '编辑'}
          </button>{' '}
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
