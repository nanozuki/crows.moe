'use client';

import NomItem from '@app/2022/nomination/[dept]/NomItem';
import Button from '@app/shared/Button';
import { BallotItem, SheetState } from './types';

interface BallotViewerProps {
  className?: string;
  items: BallotItem[];
  setSheetState: (state: SheetState) => void;
}

export default function BallotViewer({ className, items, setSheetState }: BallotViewerProps) {
  const handleClick = () => {
    setSheetState(SheetState.Editing);
  };
  return (
    <section className={`w-full flex flex-col gap-y-4 ${className || ''}`}>
      <p>请在左侧写入作品的排名数字</p>
      <div className="w-full grid grid-cols-ballot gap-x-2 gap-y-4">
        {items.map(({ ranking, work }) => [
          <div
            className="h-8 w-8 text-center leading-8 bg-overlay text-love rounded self-center"
            key={`ranking-${work.name}`}
          >
            {ranking || ''}
          </div>,
          <NomItem key={`work-${work.name}`} {...work} />,
        ])}
      </div>
      <div className="w-full flex flex-row justify-end">
        <Button className="w-full mid:max-w-[20rem]" variant="secondary" onClick={handleClick} type="button">
          编辑
        </Button>
      </div>
    </section>
  );
}
