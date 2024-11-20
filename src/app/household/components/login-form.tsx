'use client';

import { useState } from 'react';
import { attempLogin } from '../actions';
import { useHouseholdStore } from '@/lib/zustand/store';
import { redirect } from 'next/navigation';

export const LoginForm: React.FC = () => {
  const [householdName, setHouseHoldName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { login } = useHouseholdStore();

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorText(null);

    // TODO: Hash + salt password here

    const loginResponse = await attempLogin(householdName!, password!);

    if (!loginResponse.success) {
      // error stuff here?
      setErrorText(loginResponse.message);
      return;
    }

    // set login state with zustand store
    login(householdName!, loginResponse.householdId);
    redirect(`/household/${loginResponse.householdId}`);
  };

  const invalidLogin = !householdName || !password;

  return (
    <form className='flex flex-col mb-16' onSubmit={loginSubmit}>
      <label htmlFor='householdId'>Household name</label>
      <input
        type='text'
        name='householdId'
        className='mb-8'
        onChange={(e) => setHouseHoldName(e.target.value)}
      />

      <label htmlFor='householdPassword'>Household password</label>
      <input
        type='password'
        name='housholdPassword'
        className='mb-8'
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type='submit'
        value='Submit'
        disabled={invalidLogin}
        className={`flex justify-center w-16 transition-colors mb-4 ${
          invalidLogin
            ? 'bg-amber-100 text-gray-300 hover:cursor-not-allowed'
            : 'bg-amber-200'
        }`}
      >
        Login
      </button>
      {errorText && <p className='text-red-500'>{errorText}</p>}
    </form>
  );
};
