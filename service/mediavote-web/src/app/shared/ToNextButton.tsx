import Link from 'next/link';
import { ChevronRight } from 'react-feather'

interface ToNextButtonProps {
  to: string;
  label: string;
  className?: string;
}

function ToNextButton({ label, to, className }: ToNextButtonProps) {
  return (
    <Link
      href={to}
      className={`flex flex-row items-center bg-highlight-med h-10 pl-4 pr-1 rounded ${className || ''}`}
    >
      <p className="mr-1">{label}</p>
      <ChevronRight className="block text-xl leading-none text-rose" />
    </Link>
  );
}

export default ToNextButton;
