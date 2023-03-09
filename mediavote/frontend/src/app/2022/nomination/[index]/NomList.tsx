import { Nom } from '@app/data/noms';
import { useState } from 'react';
import NomItem from './NomItem';
import PostForm from './PostForm';

interface NomListProps {
  className?: string;
  noms: Nom[];
}

export default function NomList({ className, noms }: NomListProps) {
  const [nomsState, _] = useState(noms);
  return (
    <div className={`${className}`}>
      {nomsState.map((nom) => {
        const props = { ...nom, className: 'mt-4' };
        return <NomItem key={nom.name} {...props} />;
      })}
      <PostForm className="mt-2 mb-4" />
    </div>
  );
}
