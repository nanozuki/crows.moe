'use client';

import { loginVoter, newVoter } from '@app/lib/apis';
import { Head2, Text } from '@app/shared/article';
import Button from '@app/shared/Button';
import Input from '@app/shared/Input';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface NewVoteSectionProps {
  setPinCode: (pin: string) => void;
}

function NewVoterForm({ setPinCode }: NewVoteSectionProps) {
  const [voter, setVoter] = useState('');
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const voterInfo = await newVoter(voter);
      setError(undefined);
      setVoter('');
      setPinCode(voterInfo.pin_code);
    } catch (err) {
      setError('错误: ' + (err as Error).message);
    } finally {
      setFetching(false);
    }
  };
  return (
    <form className="mt-8 mb-8 mid:max-w-[20rem]" onSubmit={handleSubmit}>
      <Head2>新投票</Head2>
      <div className="mt-4 mb-4">
        <Input
          className="mt-1 mb-1"
          label="投票人ID"
          value={voter}
          onChange={setVoter}
          errorMessage={error}
        />
      </div>
      <Button variant="primary" disabled={fetching} type="submit">
        确定
      </Button>
    </form>
  );
}

interface LoginFormProps {
  next: string;
}

function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const [voter, setVoter] = useState('');
  const [pin, setPin] = useState('');
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await loginVoter(voter, pin);
      setError(undefined);
      router.push(next);
    } catch (err) {
      setError('错误: ' + (err as Error).message);
    } finally {
      setFetching(false);
    }
  };
  return (
    <form className="mt-8 mb-8 mid:max-w-[20rem]" onSubmit={handleSubmit}>
      <Head2>查看和修改投票</Head2>
      <div className="mt-4 mb-4">
        <Input
          className="mt-1 mb-1"
          label="投票人ID"
          value={voter}
          onChange={setVoter}
          errorMessage={error}
        />
        <Input
          className="mt-1 mb-1"
          label="PIN Code"
          value={pin}
          onChange={setPin}
        />
      </div>
      <Button variant="primary" disabled={fetching} type="submit">
        确定
      </Button>
    </form>
  );
}

interface PinCodeDialogProps {
  pinCode: string;
  next: string;
}

function PinCodeDialog({ pinCode, next }: PinCodeDialogProps) {
  const router = useRouter();
  const handleClick = (e: Event) => {
    e.preventDefault();
    router.push(next);
  };
  return (
    <div className="mt-8 mb-8 flex flex-col gap-y-4">
      <Head2>投票人已创建</Head2>
      <Text>
        此浏览器也会在投票期间记住投票人信息，可以在投票完成后通过重新查看或者编辑投票。如果需要在其它设备上操作或者丢失登录状态，可以使用以下
        Pin Code 重新登录，请妥善保存：
      </Text>
      <div className="w-full mid:max-w-[20rem] bg-overlay rounded py-6 text-center">
        <div className="text-2xl">{pinCode}</div>
      </div>
      <Button
        className="w-full mid:max-w-[20rem]"
        variant="primary"
        onClick={handleClick}
      >
        确定
      </Button>
    </div>
  );
}

interface VoterFormProps {
  next: string;
}

export default function VoterForm({ next }: VoterFormProps) {
  const [pinCode, setPinCode] = useState<string | undefined>(undefined);
  if (pinCode) {
    return <PinCodeDialog pinCode={pinCode} next={next} />;
  }
  return (
    <>
      <NewVoterForm setPinCode={setPinCode} />
      <LoginForm next={next} />
    </>
  );
}
