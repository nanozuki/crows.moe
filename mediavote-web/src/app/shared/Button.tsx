'use client';

import { useButton } from 'react-aria';
import { ReactNode, useRef } from 'react';

interface ButtonProps {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  onClick?: (e: Event) => void;
}

export default function Button(props: ButtonProps) {
  let ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);
  const { className, children, disabled, type } = props;

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={className}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
