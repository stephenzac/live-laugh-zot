'use client';

import { useState } from 'react';
import { attempLogin } from '../app/household/actions';
import { useHouseholdStore } from '@/lib/zustand/store';
import { redirect } from 'next/navigation';

export const LoginForm: React.FC = () => {
  const [householdName, setHouseHoldName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { login } = useHouseholdStore();

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (invalidLogin) {
      setErrorText('Please fill out all fields.');
      return;
    }

    setErrorText(null);

    const loginResponse = await attempLogin(householdName, password);

    if (!loginResponse.success) {
      setErrorText(loginResponse.message);
      return;
    }

    // set login state with zustand store
    login(householdName, loginResponse.householdId);
    redirect(`/household/${loginResponse.householdId}`);
  };

  const invalidLogin = !householdName || !password;

  return (
    <form className='flex flex-col mb-16' onSubmit={loginSubmit}>
      <label htmlFor='householdId'>Household name (case sensitive)</label>
      <input
        type='text'
        name='householdId'
        placeholder='Household Name'
        className='text-center rounded-md border-2 border-slate-300 p-2 w-full mb-8'
        onChange={(e) => setHouseHoldName(e.target.value)}
      />

      <label htmlFor='householdPassword'>Household password</label>
      <input
        type='password'
        name='housholdPassword'
        placeholder='Password'
        className='text-center rounded-md border-2 border-slate-300 p-2 w-full mb-8'
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type='submit'
        value='Submit'
        disabled={invalidLogin}
        className={`text-white font-bold p-2 rounded-md w-full transition-colors ${
          invalidLogin
            ? 'bg-amber-100 text-gray-500 hover:cursor-not-allowed'
            : 'bg-orange-300'
        }`}
      >
        Login
      </button>
      {errorText && <p className='text-red-500'>{errorText}</p>}
    </form>
  );
};
