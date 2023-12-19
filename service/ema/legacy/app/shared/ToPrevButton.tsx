import Link from 'next/link';
import { ChevronLeft } from 'react-feather';

interface ToPrevButtonProps {
  to: string;
  className?: string;
}

function ToPrevButton({ to, className }: ToPrevButtonProps) {
  return (
    <Link href={to} className={`flex flex-row items-center bg-highlight-med h-10 pl-2 pr-2 rounded ${className || ''}`}>
      <ChevronLeft className="block text-xl leading-none text-rose" />
    </Link>
  );
}

export default ToPrevButton;
