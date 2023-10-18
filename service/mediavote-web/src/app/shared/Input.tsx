'use client';

import { useTextField } from 'react-aria';
import { useRef } from 'react';

interface InputProps {
  className?: string;
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;

  onChange?: (value: string) => void;
  value: string;
}

export default function Input(props: InputProps) {
  let { label } = props;
  let ref = useRef<HTMLInputElement>(null);
  let { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, ref);

  return (
    <div className={`${props.className || ''}`}>
      <label className="block text-subtle text-sm" {...labelProps}>
        {label}
      </label>
      {props.description && (
        <div className="text-muted text-xs" {...descriptionProps}>
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div className="text-love" {...errorMessageProps}>
          {props.errorMessage}
        </div>
      )}
      <input
        className={
          'block w-full h-10 mt-1 px-2 rounded bg-surface border-pine border-2 ' +
          'focus:border-rose focus-visible:border-rose outline-none shadow-none'
        }
        ref={ref}
        {...inputProps}
      />
    </div>
  );
}
