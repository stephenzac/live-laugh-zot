'use client';

import { useState } from 'react';
import { login } from '../actions';

export const LoginForm: React.FC = () => {
  const [householdId, setHouseHoldId] = useState<string | null>(null);
  const [householdPassword, setHouseholdPassword] = useState<string | null>(
    null
  );

  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(householdId!, householdPassword!);
  };

  const invalidLogin = !householdId || !householdPassword;

  return (
    <form className='flex flex-col' onSubmit={loginSubmit}>
      <label htmlFor='householdId'>Household ID:</label>
      <input
        type='text'
        name='householdId'
        className='mb-8'
        onChange={(e) => setHouseHoldId(e.target.value)}
      />

      <label htmlFor='householdPassword'>Household password:</label>
      <input
        type='password'
        name='housholdPassword'
        className='mb-8'
        onChange={(e) => setHouseholdPassword(e.target.value)}
      />

      <button
        type='submit'
        value='Submit'
        disabled={invalidLogin}
        className={`flex justify-center w-16 transition-colors ${
          invalidLogin
            ? 'bg-amber-100 text-gray-300 hover:cursor-not-allowed'
            : 'bg-amber-200'
        }`}
      >
        Login
      </button>
    </form>
  );
};
