'use client';

import { useState } from 'react';
import NomItem from './NomItem';
import PostForm from './PostForm';
import { type NomItemProps } from './NomItem';
import { DepartmentName, Work } from '@app/shared/models';

interface NomListProps {
  className?: string;
  noms: Work[];
  dept: DepartmentName;
}

function nomsToNomItemProps(noms: Work[]): NomItemProps[] {
  return noms.map((work) => {
    const props: NomItemProps = { name: work.name, alias: [] };
    if (work.origin_name) {
      props.alias.push(work.origin_name || '');
    }
    props.alias.push(...(work.alias || []));
    return props;
  });
}

export default function NomList({ className, noms, dept }: NomListProps) {
  const [nomsState, setNomsState] = useState(nomsToNomItemProps(noms));
  const setNoms = (noms: Work[]): void => {
    setNomsState(nomsToNomItemProps(noms));
  };
  console.log(
    'work names: ',
    noms.map((nom) => nom.name)
  );
  return (
    <div className={`${className || ''}`}>
      {nomsState.map((nom) => {
        const props = { ...nom, className: 'mt-4' };
        return <NomItem key={nom.name} {...props} />;
      })}
      <PostForm className="mt-2 mb-4" dept={dept} setNoms={setNoms} />
    </div>
  );
}
