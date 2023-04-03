import NomItem from '@app/2022/nomination/[dept]/NomItem';
import { Work, Ballot } from '@app/lib/models';
import Button from '@app/shared/Button';

interface BallotTableProps {
  className?: string;
  nominations: Work[];
  ballot: Ballot;
}

interface BallotItem {
  ranking?: number;
  work: Work;
}

// find ranking of a work in a ballot, and find work in works. All works must in returned array.
// make smalling ranking first.
function makeBallotItems(props: BallotTableProps): BallotItem[] {
  const items: BallotItem[] = props.nominations.map((work) => {
    const rankingItem = props.ballot.rankings?.find(
      (item) => item.work_name === work.name
    );
    if (rankingItem) {
      return { ranking: rankingItem.ranking, work };
    } else {
      return { work };
    }
  });
  items.sort((a, b) => {
    return (a.ranking || 0) - (b.ranking || 0);
  });
  return items;
}

export default function BallotTable(props: BallotTableProps) {
  const items = makeBallotItems(props);
  return (
    <div className={`w-full flex flex-col gap-y-4 ${props.className || ''}`}>
      <p>请在左侧写入作品的排名数字</p>
      <div className="w-full grid grid-cols-ballot gap-x-2 gap-y-4">
        {items.map(({ ranking, work }) => (
          <>
            <input
              className={
                'h-8 w-8 text-center leading-7 bg-surface rounded border-2 border-pine self-center ' +
                'focus:border-rose focus-visible:border-rose outline-none shadow-none'
              }
              key={`ranking-${work.name}`}
              value={ranking || ''}
            />
            <NomItem key={`work-${work.name}`} {...work} />
          </>
        ))}
      </div>
      <div className="w-full flex flex-row justify-end">
        <Button className="w-full mid:max-w-[20rem]" variant="primary">
          提交
        </Button>
      </div>
    </div>
  );
}
