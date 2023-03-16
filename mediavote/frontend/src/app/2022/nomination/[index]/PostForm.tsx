'use client';

import { useTextField } from 'react-aria';
import { useButton } from 'react-aria';
import { ReactNode, useRef, useState } from 'react';
import { useMutation } from 'urql';
import { doc } from '@gql/init';
import { Department, Nomination } from '@gqlgen/graphql';

interface WorkNameInputProps {
  className?: string;
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;

  onChange: (value: string) => void;
  value: string;
}

function WorkNameInput(props: WorkNameInputProps) {
  let { label } = props;
  let ref = useRef<HTMLInputElement>(null);
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(props, ref);

  return (
    <div className={`${props.className}`}>
      <label
        className="block text-subtle text-sm ml-[0.625rem]"
        {...labelProps}
      >
        {label}
      </label>
      {props.description && (
        <div className="text-muted text-xs ml-[0.625rem]" {...descriptionProps}>
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div className="text-love text-xs ml-[0.625rem]" {...errorMessageProps}>
          {props.errorMessage}
        </div>
      )}
      <input
        className={
          'block w-full h-10 mt-1 px-2 rounded bg-surface border-text border-2 ' +
          'focus:border-rose focus-visible:border-rose outline-none shadow-none'
        }
        ref={ref}
        {...inputProps}
      />
    </div>
  );
}

interface SubmitButtonProps {
  className?: string;
  children?: ReactNode;
  onClick: (e: Event) => void;
  fetching: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  let ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);

  return (
    <button
      className={`${props.className}`}
      ref={ref}
      disabled={props.fetching}
      {...buttonProps}
    >
      <p>提交提名</p>
    </button>
  );
}

interface PostFormProps {
  className?: string;
  dept: Department;
  setNoms: (noms: Nomination[]) => void;
}

export default function PostForm(props: PostFormProps) {
  const [inputText, setInputText] = useState('');
  const [{ fetching, error }, post] = useMutation(doc.addNomination);
  const onClick = async (e: Event) => {
    e.preventDefault();
    const result = await post({ dept: props.dept, work: inputText });
    if (!result.error) {
      props.setNoms(result.data?.postNomination || new Array());
      setInputText('');
    }
  };
  const btnBg = fetching ? 'bg-muted' : 'bg-pine';
  return (
    <div
      className={`flex flex-col wide:flex-row gap-2 items-end ${props.className}`}
    >
      <WorkNameInput
        className="w-full"
        label="作品名称"
        value={inputText}
        onChange={setInputText}
        errorMessage={error && error.toString()}
      />
      <SubmitButton
        className={`${btnBg} text-base w-full wide:w-[10rem] px-8 h-10 rounded`}
        onClick={onClick}
        fetching={fetching}
      />
    </div>
  );
}
