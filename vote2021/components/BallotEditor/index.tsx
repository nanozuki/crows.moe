import { useTextField } from '@react-aria/textfield';
import { FormEvent, useRef, useState, useEffect } from 'react';
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
}

const BallotEditor = ({ voteID, department }: BallotEditor) => {
  const [ballot, setBallot] = useState<Ballot>([]);
  const [edit, setEdit] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  useEffect(() => {
    fetch(`/api/vote/${voteID}/${department}`)
      .then((res) => res.json())
      .then((data: { candidates: Candidate[] }) => {
        setLoaded(true);
        if (data.candidates.length === 0) {
          setEdit(true);
          setBallot(expandBallotForEdit(data.candidates));
        } else {
          setEdit(false);
          setBallot(compressBallotForSubmit(data.candidates));
        }
      });
  }, [voteID]);

  const submit = () => {
    setEdit(false);
    const compressed = compressBallotForSubmit(ballot);
    setBallot(compressed);
    fetch(`/api/vote/${voteID}/${department}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vote_id: voteID,
        department,
        candidates: compressed,
      }),
    }).then((res) => {
      if (!res.ok) {
        setErrMessage('提交投票失败');
      } else {
        setErrMessage('');
      }
    });
  };
  const toEdit = () => {
    setEdit(true);
    setBallot(expandBallotForEdit(ballot));
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
    <section className="bg-highlight-med p-4 mt-8 mb-8">
      <p className="text-2xl font-bold font-serif leading-loose border-b-2 border-solid border-iris mb-4">
        投票
      </p>
      <form className="grid grid-cols-vote gap-2">
        <p className="leading-none text-muted">排名</p>
        <p className="leading-none">作品名</p>
        {items}
      </form>
      {loaded && (
        <>
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
            className="bg-subtle text-base block w-full text-center leading-7 mt-2"
            key="submit-btn"
            onClick={(e: FormEvent) => {
              e.preventDefault();
              edit ? submit() : toEdit();
            }}
          >
            {edit ? '完成' : '编辑'}
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
