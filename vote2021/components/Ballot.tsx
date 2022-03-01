import { useTextField } from '@react-aria/textfield';
import { FormEvent, useRef, useState } from 'react';

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

interface Work {
  ranking: number | '';
  workName: string;
}

interface WorkList {
  works: Work[];
}

const newWorkList = (): WorkList => {
  return {
    works: [
      { ranking: 1, workName: '' },
      { ranking: 2, workName: '' },
      { ranking: 3, workName: '' },
      { ranking: 4, workName: '' },
      { ranking: 5, workName: '' },
    ],
  };
};

const setWorkRanking = (
  cl: WorkList,
  index: number,
  ranking: number
): WorkList => {
  let result = { works: [...cl.works] };
  result.works[index].ranking = ranking;
  return result;
};

const setWorkName = (cl: WorkList, index: number, name: string): WorkList => {
  let result = { works: [...cl.works] };
  result.works[index].workName = name;
  return result;
};

const addWorkItem = (cl: WorkList): WorkList => {
  return {
    works: [...cl.works, { ranking: cl.works.length + 1, workName: '' }],
  };
};

const Ballot = () => {
  const [workList, setWorkList] = useState(newWorkList());
  let items: React.ReactNode[] = [];
  workList.works.forEach((work, index) => {
    items.push(
      <RankingInput
        key={`ranking-${index}`}
        label={`ranking-${index}`}
        value={work.ranking.toString()}
        onChange={(value: string) => {
          setWorkList((wl) => setWorkRanking(wl, index, parseInt(value)));
        }}
      />,
      <NameInput
        key={`workname-${index}`}
        label={`workname-${index}`}
        value={work.workName.toString()}
        onChange={(value: string) => {
          setWorkList((wl) => setWorkName(wl, index, value));
        }}
      />
    );
  });
  return (
    <section className="bg-surface p-4 mt-8 mb-8">
      <p className="text-2xl font-bold font-serif leading-loose border-b-2 border-solid border-iris mb-4">
        投票
      </p>
      <form className="grid grid-cols-vote gap-2">
        <p className="leading-none">排名</p>
        <p className="leading-none">作品名</p>
        {items}
      </form>
      <button
        className="border-solid border-1 border-text block w-full text-center leading-7 mt-2"
        onClick={(e: FormEvent) => {
          e.preventDefault();
          setWorkList((wl) => addWorkItem(wl));
        }}
      >
        +
      </button>
    </section>
  );
};

export { Ballot };
