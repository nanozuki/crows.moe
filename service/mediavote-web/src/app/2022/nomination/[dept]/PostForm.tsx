'use client';

import { useState } from 'react';
import { DepartmentName, Work } from '@app/lib/models';
import { addNomination } from '@app/lib/apis';
import { useMutation } from '@app/shared/hooks';
import { FormEvent } from 'react';
import Input from '@app/shared/Input';
import Button from '@app/shared/Button';

interface PostFormProps {
  className?: string;
  dept: DepartmentName;
  setNoms: (noms: Work[]) => void;
}

export default function PostForm(props: PostFormProps) {
  const [inputText, setInputText] = useState('');
  const [fetching, error, trigger] = useMutation(
    addNomination,
    (works: Work[]) => {
      setInputText('');
      props.setNoms(works);
    }
  );
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await trigger({ deptName: props.dept, workName: inputText });
  };
  return (
    <form
      className={`flex flex-col wide:flex-row gap-2 items-end ${
        props.className || ''
      }`}
      onSubmit={onSubmit}
    >
      <Input
        className="w-full"
        label="作品名称"
        value={inputText}
        onChange={setInputText}
        errorMessage={error && error.message}
      />
      <Button variant="primary" disabled={fetching} type="submit">
        <p>提交提名</p>
      </Button>
    </form>
  );
}
