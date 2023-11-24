'use client';

import { ChangeEvent, useState } from 'react';
import BallotViewer from './BallotViewer';
import BallotEditor from './BallotEditor';
import DeptNav from '@app/shared/DeptNav';
import TabLine from '@app/shared/TabLine';
import ToNextButton from '@app/shared/ToNextButton';
import { Department, Stage, Work } from '@service/value';
import { Ballot, Ceremony } from '@service/entity';
import { Route } from '@app/lib/route';

export const enum SheetState {
  Editing = 'editing',
  Viewing = 'viewing',
}

export interface BallotItem {
  ranking?: number;
  work: Work;
}

export function makeBallotItems(nominations: Work[], ballot: Ballot): BallotItem[] {
  const items: BallotItem[] = nominations.map((work) => {
    const rankingItem = ballot.rankings?.find((item) => item.work.name === work.name);
    if (rankingItem) {
      return { ranking: rankingItem.ranking, work };
    } else {
      return { work };
    }
  });
  sortBallotItems(items);
  return items;
}

export function sortBallotItems(items: BallotItem[]) {
  items.sort((a, b) => {
    return (a.ranking || Infinity) - (b.ranking || Infinity);
  });
}

function useBallotState(
  nominations: Work[],
  ballot: Ballot,
): [BallotItem[], (index: number) => (e: ChangeEvent<HTMLInputElement>) => void, () => void] {
  const [items, setItems] = useState(makeBallotItems(nominations, ballot));
  const setRanking = (index: number): ((e: ChangeEvent<HTMLInputElement>) => void) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let ranking: number | undefined = undefined;
      const rankingNumber = parseInt(value);
      if (!isNaN(rankingNumber) && rankingNumber > 0) {
        ranking = rankingNumber;
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

function ToThanksButton(props: { ceremony: Ceremony }) {
  const to = Route.Voting(props.ceremony, 'thanks');
  return <ToNextButton to={to} label="完成" />;
}

interface BallotTableProps {
  className?: string;
  ceremony: Ceremony;
  department: Department;
  nominations: Work[];
  ballot: Ballot;
}

export default function BallotSheet(props: BallotTableProps) {
  const initState = (props.ballot.rankings || []).length > 0 ? SheetState.Viewing : SheetState.Editing;
  const [sheetState, setSheetState] = useState<SheetState>(initState);
  const [items, setRanking, resortItems] = useBallotState(props.nominations, props.ballot);
  const index = props.ceremony.departments.indexOf(props.department);
  const setToViewing = () => {
    resortItems();
    setSheetState(SheetState.Viewing);
  };
  return (
    <>
      {sheetState === SheetState.Editing ? (
        <BallotEditor
          className={props.className}
          year={props.ceremony.year}
          department={props.department}
          items={items}
          setRanking={setRanking}
          setToViewing={setToViewing}
        />
      ) : (
        <BallotViewer className={props.className} items={items} setSheetState={setSheetState} />
      )}
      {sheetState === SheetState.Viewing ? (
        <DeptNav
          ceremony={props.ceremony}
          department={props.department}
          stage={Stage.Voting}
          tail={<ToThanksButton ceremony={props.ceremony} />}
          className="mt-12 mb-4"
        />
      ) : (
        <div className="mt-12 mb-4 h-10"></div>
      )}
      <TabLine page={index} className="mt-4 mb-4" />
    </>
  );
}
