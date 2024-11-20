'use client';

import { useHouseholdStore } from '@/lib/zustand/store';
// import { redirect } from 'next/navigation';
import { Chores } from './chores/chores';

export default function HouseHoldIdPage() {
  const { name, id, authenticated } = useHouseholdStore();

  // if (!authenticated) redirect('/');

  return (
    <>
      <h1 className='text-3xl font-bold'>Welcome to {name}!</h1>
      <Chores householdName={name!} />
    </>
  );
}
