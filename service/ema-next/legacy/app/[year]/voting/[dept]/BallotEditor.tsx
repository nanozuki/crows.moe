import NomItem from '@app/[year]/nomination/[dept]/NomItem';
import { EditBallotResponse } from '@app/api/ballots/edit/route';
import { editBallot } from '@app/lib/apis';
import Button from '@app/shared/Button';
import { useMutation } from '@app/shared/hooks';
import { Department } from '@service/value';
import { ChangeEvent, FormEvent } from 'react';
import { BallotItem } from './BallotSheet';

interface BallotEditorProps {
  className?: string;
  year: number;
  department: Department;
  items: BallotItem[];
  setRanking: (index: number) => (e: ChangeEvent<HTMLInputElement>) => void;
  setToViewing: () => void;
}

export default function BallotEditor({
  className,
  year,
  department,
  items,
  setRanking,
  setToViewing,
}: BallotEditorProps) {
  const [fetching, error, trigger] = useMutation(editBallot, (_: EditBallotResponse) => {
    setToViewing();
  });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const rankings = items
      .filter((item) => item.ranking)
      .map((item) => ({
        ranking: item.ranking as number,
        workName: item.work.name,
      }))
      .sort((a, b) => a.ranking - b.ranking);
    await trigger({ year, department, rankings });
  };
  return (
    <form className={`w-full flex flex-col gap-y-4 ${className || ''}`} onSubmit={handleSubmit}>
      <p>请在左侧写入作品的排名数字</p>
      <div className="w-full grid grid-cols-ballot gap-x-2 gap-y-4">
        {items.map(({ ranking, work }, index) => [
          <input
            className={
              'h-8 w-8 text-center leading-7 bg-surface rounded border-2 border-pine self-center ' +
              'focus:border-rose focus-visible:border-rose outline-none shadow-none'
            }
            key={`ranking-${work.name}`}
            value={ranking || ''}
            type="number"
            onChange={setRanking(index)}
          />,
          <NomItem key={`work-${work.name}`} {...work} />,
        ])}
      </div>
      {error && <div className="text-love">{error.message}</div>}
      <div className="w-full flex flex-row justify-end">
        <Button className="w-full mid:max-w-[20rem]" variant="primary" disabled={fetching} type="submit">
          提交
        </Button>
      </div>
    </form>
  );
}
