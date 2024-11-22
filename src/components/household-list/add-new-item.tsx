import { ChangeEvent } from 'react';

interface AddNewItemProps {
  addNewItemFunction: (e: React.FormEvent) => void;
  setNewItemFunction: (e: ChangeEvent<HTMLInputElement>) => void;
  newItem: string | null;
  placeHolderText: string;
}

export const AddNewItem: React.FC<AddNewItemProps> = ({
  addNewItemFunction,
  setNewItemFunction,
  newItem,
  placeHolderText,
}) => {
  return (
    <form onSubmit={addNewItemFunction} className='mb-4'>
      <input
        className='text-center rounded-md border-2 border-slate-300'
        type='text'
        onChange={setNewItemFunction}
        placeholder={placeHolderText}
        value={newItem ?? ''}
      />
    </form>
  );
};
