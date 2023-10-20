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
  field: string;
  value: string;
}

export default function Input(props: InputProps) {
  let { label } = props;
  let ref = useRef<HTMLInputElement>(null);
  let { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, ref);

  return (
    <div className={`${props.className || ''}`}>
      <label {...labelProps} className="block text-subtle text-sm" htmlFor={props.field} >
        {label}
      </label>
      {props.description && (
        <div {...descriptionProps} className="text-muted text-xs">
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div {...errorMessageProps} className="text-love">
          {props.errorMessage}
        </div>
      )}
      <input
        {...inputProps}
        id={props.field}
        className={
          'block w-full h-10 mt-1 px-2 rounded bg-surface border-pine border-2 ' +
          'focus:border-rose focus-visible:border-rose outline-none shadow-none'
        }
        ref={ref}
      />
    </div>
  );
}
