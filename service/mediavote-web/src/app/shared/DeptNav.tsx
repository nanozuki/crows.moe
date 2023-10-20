import ToNextButton from '@app/shared/ToNextButton';
import ToPrevButton from '@app/shared/ToPrevButton';
import { ReactElement } from 'react';
import { Department, Stage, departmentTitle } from '@service/value';
import { Year } from '@service/entity';

interface ToPrevDPProps {
  year: number;
  prev?: Department;
  stage: Stage;
  head?: ReactElement;
  className?: string;
}

function ToPrevDP({ year, prev, stage, head, className }: ToPrevDPProps) {
  if (!prev) {
    return head || <div></div>;
  }
  return <ToPrevButton to={`/${year}/${stage.toLowerCase()}/${prev}`} className={`${className || ''}`} />;
}

interface ToNextDPProps {
  year: number;
  next?: Department;
  stage: Stage;
  tail?: ReactElement;
  className?: string;
}

function ToNextDP({ year, next, stage, tail, className }: ToNextDPProps) {
  if (!next) {
    return tail || <div></div>;
  }
  const title = departmentTitle[next];
  return (
    <ToNextButton
      className={`${className || ''}`}
      to={`/${year}/${stage.toLowerCase()}/${next}`}
      label={`Next: ${title}部门`}
    />
  );
}

interface DeptNavProps {
  year: Year;
  department: Department;
  stage: Stage;
  head?: ReactElement;
  tail?: ReactElement;
  className?: string;
}

export default function DeptNav({ year, department, stage, head, tail, className }: DeptNavProps) {
  const index = year.departments.indexOf(department);
  const prev = index === 0 ? undefined : year.departments[index - 1];
  const next = index === year.departments.length - 1 ? undefined : year.departments[index + 1];
  return (
    <div className={`flex flex-row justify-between ${className || ''}`}>
      <ToPrevDP year={year.year} prev={prev} stage={stage} head={head} />
      <ToNextDP year={year.year} next={next} stage={stage} tail={tail} />
    </div>
  );
}
