'use client';

import { useState } from 'react';
import { addNomination } from '@app/lib/apis';
import { useMutation } from '@app/shared/hooks';
import { FormEvent } from 'react';
import Input from '@app/shared/Input';
import Button from '@app/shared/Button';
import { AddNominationsResponse } from '@app/api/nominations/add/route';
import { Department, Work } from '@service/value';

interface PostFormProps {
  className?: string;
  year: number;
  dept: Department;
  setNoms: (noms: Work[]) => void;
}

export default function PostForm(props: PostFormProps) {
  const [inputText, setInputText] = useState('');
  const [fetching, error, trigger] = useMutation(addNomination, (res: AddNominationsResponse) => {
    setInputText('');
    props.setNoms(res.works);
  });
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await trigger({
      year: props.year,
      department: props.dept,
      workName: inputText,
    });
  };
  return (
    <form className={`flex flex-col wide:flex-row gap-2 items-end ${props.className || ''}`} onSubmit={onSubmit}>
      <Input
        className="w-full"
        label="作品名称"
        value={inputText}
        field="workName"
        onChange={setInputText}
        errorMessage={error && error.message}
      />
      <Button variant="primary" disabled={fetching} type="submit">
        <p>提交提名</p>
      </Button>
    </form>
  );
}
