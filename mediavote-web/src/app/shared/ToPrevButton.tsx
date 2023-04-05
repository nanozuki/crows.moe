import Link from 'next/link';
import IconChevronLeft from '~icons/material-symbols/chevron-left.jsx';

interface ToPrevButtonProps {
  to: string;
  className?: string;
}

function ToPrevButton({ to, className }: ToPrevButtonProps) {
  return (
    <Link
      href={to}
      className={`flex flex-row items-center bg-highlight-med h-10 pl-2 pr-2 rounded ${className || ''}`}
    >
      <IconChevronLeft className="block text-xl leading-none text-rose" />
    </Link>
  );
}

export default ToPrevButton;
