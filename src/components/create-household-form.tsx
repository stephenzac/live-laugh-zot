'use client';

import { useEffect, useState } from 'react';
import { createHousehold } from '../app/household/actions';
import { useHouseholdStore } from '@/lib/zustand/store';
import { redirect } from 'next/navigation';
import { genSaltSync, hashSync } from 'bcryptjs';

export const CreateHouseholdForm: React.FC = () => {
  const [householdName, setHouseholdName] = useState<string | null>(null);
  const [password1, setPassword1] = useState<string | null>(null);
  const [password2, setPassword2] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { login } = useHouseholdStore();

  useEffect(() => {
    if (!password1 || !password2) {
      setErrorText(null);
      return;
    }

    if (password1 !== password2) setErrorText('Passwords must match.');
    else setErrorText(null);
  }, [password1, password2]);

  const createHouseholdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorText(null);

    if (invalidEntry) {
      setErrorText('Please fill out all fields.');
      return;
    }

    const salt = genSaltSync(10);
    const passwordHash = hashSync(password1, salt);

    const createHouseholdResponse = await createHousehold(
      householdName,
      passwordHash
    );

    if (!createHouseholdResponse.success) {
      setErrorText(createHouseholdResponse.message);
      return;
    }

    // zustand login store here, redirect to new household page
    login(householdName, createHouseholdResponse.householdId!);
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
        placeholder='Household Name'
        className='text-center rounded-md border-2 border-slate-300 p-2 w-full mb-8'
        onChange={(e) => setHouseholdName(e.target.value)}
      />

      <label htmlFor='householdPassword1'>Household password</label>
      <input
        type='password'
        name='housholdPassword1'
        placeholder='Password'
        className='text-center rounded-md border-2 border-slate-300 p-2 w-full mb-8'
        onChange={(e) => setPassword1(e.target.value)}
      />

      <label htmlFor='householdPassword2'>Confirm household password</label>
      <input
        type='password'
        name='housholdPassword2'
        placeholder='Confirm Password'
        className='text-center rounded-md border-2 border-slate-300 p-2 w-full mb-8'
        onChange={(e) => setPassword2(e.target.value)}
      />

      <button
        type='submit'
        value='Submit'
        disabled={invalidEntry}
        className={`text-white font-bold p-2 rounded-md w-full transition-colors ${
          invalidEntry
            ? 'bg-amber-100 text-gray-300 hover:cursor-not-allowed mb-10'
            : 'bg-amber-200 mb-10'
        }`}
      >
        Create
      </button>
      {errorText && <p className='text-red-500'>{errorText}</p>}
    </form>
  );
};
