import { useState, FormEvent } from 'react';
import { TextField } from './TextField';

interface EntranceProps {
  title: string;
  label: string;
  onSubmit: (value: string) => Promise<void>;
}

const Entrance = (props: EntranceProps) => {
  const [value, setValue] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const handleChange = (s: string) => {
    setErrMessage('');
    setValue(s);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await props.onSubmit(value);
    } catch (e) {
      if (e instanceof Error) {
        setErrMessage(e.message);
      }
    }
  };
  return (
    <form className="mt-16 mb-16" onSubmit={handleSubmit}>
      <h1 className="text-xl font-serif mt-4 mb-4 text-love">{props.title}</h1>
      <TextField
        className="w-full sm:w-1/2"
        label={props.label}
        errorMessage={errMessage}
        onChange={handleChange}
      />
      <button
        className="w-full sm:w-1/2 block bg-subtle text-base pt-1 pb-1 pl-4 pr-4 mt-2 mb-2"
        onClick={handleSubmit}
      >
        <p>前往</p>
      </button>
    </form>
  );
};

export { Entrance };
