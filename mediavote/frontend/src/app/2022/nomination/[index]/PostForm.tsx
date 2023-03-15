"use client";

import { useTextField } from "react-aria";
import { useButton } from "react-aria";
import { ReactNode, useRef, useState } from "react";
import { useMutation } from "urql";
import { doc } from "@gql/init";
import { Department } from "@gqlgen/graphql";
import { useRouter } from "next/navigation";

interface WorkNameInputProps {
  className?: string;
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;

  onChange: (value: string) => void;
  text: string;
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
          "block w-full h-10 mt-1 px-2 rounded bg-surface border-text border-2 " +
          "focus:border-rose focus-visible:border-rose outline-none shadow-none"
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
}

function SubmitButton(props: SubmitButtonProps) {
  let ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);

  return (
    <button className={`${props.className}`} ref={ref} {...buttonProps}>
      <p>提交提名</p>
    </button>
  );
}

interface PostFormProps {
  className?: string;
  dept: Department;
}

export default function PostForm(props: PostFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [errMessage, setErrMessage] = useState<string | undefined>();
  const [_, post] = useMutation(doc.addNomination);
  const onClick = async (e: Event) => {
    const result = await post({ dept: props.dept, work: text });
    if (result.error) {
      setErrMessage(result.error.toString());
    } else {
      setErrMessage(undefined);
    }
    router.refresh();
  };
  return (
    <div
      className={`flex flex-col wide:flex-row gap-2 items-end ${props.className}`}
    >
      <WorkNameInput
        className="w-full"
        label="作品名称"
        text={text}
        onChange={setText}
        errorMessage={errMessage}
      />
      <SubmitButton
        className="bg-pine text-base w-full wide:w-[10rem] px-8 h-10 rounded"
        onClick={onClick}
      />
    </div>
  );
}
