'use client';

import { useButton } from 'react-aria';
import { ReactNode, useRef } from 'react';

interface ButtonProps {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'negative';
  type?: 'submit' | 'reset' | 'button' | undefined;
  onClick?: (e: Event) => void;
}

export default function Button(props: ButtonProps) {
  let ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);
  const { className, children, disabled, variant, type } = props;
  let bg;
  if (disabled) {
    bg = 'bg-muted';
  } else if (variant === 'secondary') {
    bg = 'bg-love';
  } else if (variant === 'negative') {
    bg = 'bg-gold';
  } else {
    bg = 'bg-pine';
  }

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={`${bg} text-base w-full px-8 h-10 rounded ${className || ''}`}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
