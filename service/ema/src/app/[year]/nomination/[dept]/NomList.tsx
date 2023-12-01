'use client';

import { useState } from 'react';
import NomItem from './NomItem';
import PostForm from './PostForm';
import { Department, Work } from '@service/value';

interface NomListProps {
  className?: string;
  year: number;
  noms: Work[];
  dept: Department;
}

export default function NomList({ className, noms, dept, year }: NomListProps) {
  const [nomsState, setNomsState] = useState(noms);
  return (
    <div className={`${className || ''}`}>
      {nomsState.map((nom) => {
        const props = { ...nom, className: 'mt-4' };
        return <NomItem key={nom.name} {...props} />;
      })}
      <PostForm className="mt-2 mb-4" year={year} dept={dept} setNoms={setNomsState} />
    </div>
  );
}
