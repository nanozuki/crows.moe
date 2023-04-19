import { useTextField } from '@react-aria/textfield';
import { useRef } from 'react';

interface TextFieldProps {
  label: string;
  className?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const TextField = (props: TextFieldProps) => {
  let { label } = props;
  let ref = useRef<HTMLInputElement>(null);
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(props, ref);

  return (
    <div className={props.className}>
      <label className="block text-subtle text-sm " {...labelProps}>
        {label}
      </label>
      <input className="block w-full p-1 mt-1 mb-1" ref={ref} {...inputProps} />
      {props.description && (
        <div className="text-muted text-xs" {...descriptionProps}>
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div className="text-love text-xs" {...errorMessageProps}>
          {props.errorMessage}
        </div>
      )}
    </div>
  );
};
