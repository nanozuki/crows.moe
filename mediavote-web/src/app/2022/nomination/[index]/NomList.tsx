'use client';

import { useState } from 'react';
import NomItem from './NomItem';
import PostForm from './PostForm';
import { Department, type Nomination } from '@gqlgen/graphql';
import { type NomItemProps } from './NomItem';

interface NomListProps {
  className?: string;
  noms: Nomination[];
  dept: Department;
}

function nomsToNomItemProps(noms: Nomination[]): NomItemProps[] {
  const aliasMap: Map<string, Set<string>> = new Map();
  Array.from(noms).forEach((nom) => {
    if (!nom.work) {
      const set: Set<string> = new Set();
      set.add(nom.workName);
      aliasMap.set(nom.workName, set);
    } else {
      const alias = aliasMap.get(nom.work.nameCN);
      if (!alias) {
        const set: Set<string> = new Set();
        [nom.work.nameCN, nom.work.nameOrigin, nom.workName].forEach((n) =>
          set.add(n)
        );
        aliasMap.set(nom.work.nameCN, set);
      } else {
        alias.add(nom.workName);
      }
    }
  });
  const props: NomItemProps[] = [];
  for (let s of aliasMap.values()) {
    const names: Array<string> = Array.from(s);
    props.push({
      name: names[0],
      alias: names.slice(1),
    });
  }
  return props;
}

export default function NomList({ className, noms, dept }: NomListProps) {
  const [nomsState, setNomsState] = useState(nomsToNomItemProps(noms));
  const setNoms = (noms: Nomination[]): void => {
    setNomsState(nomsToNomItemProps(noms));
  };
  return (
    <div className={`${className}`}>
      {nomsState.map((nom) => {
        const props = { ...nom, className: 'mt-4' };
        return <NomItem key={nom.name} {...props} />;
      })}
      <PostForm className="mt-2 mb-4" dept={dept} setNoms={setNoms} />
    </div>
  );
}
