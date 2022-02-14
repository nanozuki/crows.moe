import { useState, FormEvent } from 'react';
import { TextField } from './TextField';

interface EntranceProps {
  title: string;
  onSubmit: (value: string) => void;
}

const Entrance = (props: EntranceProps) => {
  const [value, setValue] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const handleChange = (s: string) => {
    setErrMessage('');
    setValue(s);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      props.onSubmit(value);
    } catch (e) {
      if (e instanceof Error) {
        setErrMessage(e.message);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-xl mt-em font-serif">{props.title}</h1>
      <TextField
        className="w-full max-w-xs"
        label="Telegram ID 或用户名"
        errorMessage={errMessage}
        onChange={handleChange}
      />
      <button
        className="w-full max-w-xs block bg-subtle text-base pt-1 pb-1 pl-4 pr-4 mt-2 mb-2 rounded-md"
        onClick={handleSubmit}
      >
        <p>前往</p>
      </button>
    </form>
  );
};

export { Entrance };
