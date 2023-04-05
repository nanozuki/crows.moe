'use client';

import { Work, Ballot, DepartmentName, Stage } from '@app/lib/models';
import { ChangeEvent, useState } from 'react';
import BallotViewer from './BallotViewer';
import BallotEditor from './BallotEditor';
import {
  SheetState,
  BallotItem,
  makeBallotItems,
  sortBallotItems,
} from './types';
import DeptNav from '@app/shared/DeptNav';
import { departments } from '@app/shared/Departments';
import TabLine from '@app/shared/TabLine';
import ToNextButton from '@app/shared/ToNextButton';

interface BallotTableProps {
  className?: string;
  dept: DepartmentName;
  nominations: Work[];
  ballot: Ballot;
}

function useBallotState(
  nominations: Work[],
  ballot: Ballot
): [
  BallotItem[],
  (index: number) => (e: ChangeEvent<HTMLInputElement>) => void,
  () => void
] {
  const [items, setItems] = useState(makeBallotItems(nominations, ballot));
  const setRanking = (
    index: number
  ): ((e: ChangeEvent<HTMLInputElement>) => void) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let ranking: number | undefined = undefined;
      const rankingNumer = parseInt(value);
      if (!isNaN(rankingNumer) && rankingNumer > 0) {
        ranking = rankingNumer;
      }
      const newItems = [...items];
      newItems[index].ranking = ranking;
      setItems(newItems);
    };
  };
  const resortItems = () => {
    const newItems = [...items];
    sortBallotItems(newItems);
    setItems(newItems);
  };
  return [items, setRanking, resortItems];
}

function ToThanksButton() {
  return <ToNextButton to={`/2022/voting/thanks`} label="完成" />;
}

export default function BallotSheet(props: BallotTableProps) {
  const initState =
    (props.ballot.rankings || []).length > 0
      ? SheetState.Viewing
      : SheetState.Editing;
  const [sheetState, setSheetState] = useState<SheetState>(initState);
  const [items, setRanking, resortItems] = useBallotState(
    props.nominations,
    props.ballot
  );
  const index = departments.findIndex((info) => info.dept === props.dept);
  const setToViewing = () => {
    resortItems();
    setSheetState(SheetState.Viewing);
  };
  return (
    <>
      {sheetState === SheetState.Editing ? (
        <BallotEditor
          className={props.className}
          dept={props.dept}
          items={items}
          setRanking={setRanking}
          setToViewing={setToViewing}
        />
      ) : (
        <BallotViewer
          className={props.className}
          items={items}
          setSheetState={setSheetState}
        />
      )}
      {sheetState === SheetState.Viewing && (
        <DeptNav
          dept={props.dept}
          stage={Stage.Voting}
          tail={<ToThanksButton />}
          className="mt-12 mb-4"
        />
      )}
      {sheetState === SheetState.Viewing && (
        <TabLine page={index} className="mt-4 mb-4" />
      )}
    </>
  );
}
