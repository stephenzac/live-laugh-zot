'use client';

import { useState } from 'react';
import { createHousehold } from '../actions';
import { useHouseholdStore } from '@/lib/zustand/store';
import { redirect } from 'next/navigation';

export const CreateHouseholdForm: React.FC = () => {
  const [householdName, setHouseholdName] = useState<string | null>(null);
  const [password1, setPassword1] = useState<string | null>(null);
  const [password2, setPassword2] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { login } = useHouseholdStore();

  const createHouseholdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorText(null);

    // TODO: hash + salt password here
    console.log(householdName, password1);

    const createHouseholdResponse = await createHousehold(
      householdName!,
      password1!
    );
    console.log(createHouseholdResponse);

    if (!createHouseholdResponse.success) {
      setErrorText(createHouseholdResponse.message);
      return;
    }

    // zustand store stuff here, redirect to new household page
    login(householdName!, createHouseholdResponse.householdId);
    redirect(`/household/${createHouseholdResponse.householdId}`);
  };

  const invalidEntry =
    !householdName || !password1 || !password2 || password1 !== password2;

  return (
    <form className='flex flex-col' onSubmit={createHouseholdSubmit}>
      <label htmlFor='householdId'>Household name</label>
      <input
        type='text'
        name='householdId'
        className='mb-8'
        onChange={(e) => setHouseholdName(e.target.value)}
      />

      <label htmlFor='householdPassword1'>Household password</label>
      <input
        type='password'
        name='housholdPassword1'
        className='mb-8'
        onChange={(e) => setPassword1(e.target.value)}
      />

      <label htmlFor='householdPassword2'>Confirm household password</label>
      <input
        type='password'
        name='housholdPassword2'
        className='mb-8'
        onChange={(e) => setPassword2(e.target.value)}
      />

      <button
        type='submit'
        value='Submit'
        disabled={invalidEntry}
        className={`flex justify-center w-16 transition-colors ${
          invalidEntry
            ? 'bg-amber-100 text-gray-300 hover:cursor-not-allowed'
            : 'bg-amber-200'
        }`}
      >
        Create
      </button>
      {errorText && <p className='text-red-500'>{errorText}</p>}
    </form>
  );
};
