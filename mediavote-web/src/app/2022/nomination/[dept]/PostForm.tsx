'use client';

import { useState } from 'react';
import { DepartmentName, Work } from '@app/shared/models';
import { addNomination } from '@app/shared/apis';
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
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const post = async () => {
    setFetching(true);
    try {
      const works = await addNomination(props.dept, inputText);
      setError(undefined);
      setInputText('');
      props.setNoms(works);
    } catch (e) {
      setError('错误: ' + (e as Error).message);
    } finally {
      setFetching(false);
    }
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await post();
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
        errorMessage={error && error.toString()}
      />
      <Button variant="primary" disabled={fetching} type="submit">
        <p>提交提名</p>
      </Button>
    </form>
  );
}
