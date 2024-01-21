import { Work } from '@service/value';

export interface NomItemProps extends Work {
  className?: string;
}

export default function NomItem({ name, originName, alias, className }: NomItemProps) {
  const subNames = [originName, ...(alias || [])];
  return (
    <div
      className={`flex flex-col wide:flex-row items-start wide:items-center px-4 py-2 bg-overlay rounded ${
        className || ''
      }`}
    >
      <p className="flex-1 font-serif text-2xl">{name}</p>
      <div className="flex-1">
        {subNames.map((a) => (
          <p className="text-subtle" key={a}>
            {a}
          </p>
        ))}
      </div>
    </div>
  );
}
