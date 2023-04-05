import ToNextButton from '@app/shared/ToNextButton';
import ToPrevButton from '@app/shared/ToPrevButton';
import { departments } from '@app/shared/Departments';
import { DepartmentName, Stage } from '@app/lib/models';
import { ReactElement } from 'react';

interface ToPrevDPProps {
  index: number;
  stage: Stage;
  head?: ReactElement;
  className?: string;
}

function ToPrevDP({ index, stage, head, className }: ToPrevDPProps) {
  if (index === 0) {
    return head || <div></div>;
  }
  const prev = departments[index - 1];
  return (
    <ToPrevButton
      to={`/2022/${stage.toLowerCase()}/${prev.dept}`}
      className={`${className || ''}`}
    />
  );
}

interface ToNextDPProps {
  index: number;
  stage: Stage;
  tail?: ReactElement;
  className?: string;
}

function ToNextDP({ index, stage, tail, className }: ToNextDPProps) {
  if (index === departments.length - 1) {
    return tail || <div></div>;
  }
  const next = departments[index + 1];
  return (
    <ToNextButton
      className={`${className || ''}`}
      to={`/2022/${stage.toLowerCase()}/${next.dept}`}
      label={`Next: ${next.title}部门`}
    />
  );
}

interface DeptNavProps {
  dept: DepartmentName;
  stage: Stage;
  head?: ReactElement;
  tail?: ReactElement;
  className?: string;
}

export default function DeptNav({
  dept,
  stage,
  head,
  tail,
  className,
}: DeptNavProps) {
  const index = departments.findIndex((info) => info.dept === dept);
  return (
    <div className={`flex flex-row justify-between ${className || ''}`}>
      <ToPrevDP index={index} stage={stage} head={head} />
      <ToNextDP index={index} stage={stage} tail={tail} />
    </div>
  );
}
