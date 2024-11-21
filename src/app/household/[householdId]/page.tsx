'use client';

import { useHouseholdStore } from '@/lib/zustand/store';
import { redirect } from 'next/navigation';
import { Chores } from './chores/chores';
import { Residents } from './residents/residents';
import { Groceries } from './groceries/groceries';
import { CostSplitter } from './cost-splitter/cost-splitter';

export default function HouseholdPage() {
  const { name, id, authenticated } = useHouseholdStore();

  if (!authenticated) redirect('/');

  return (
    <>
      <h1 className='text-3xl font-bold mb-14'>Welcome to {name}!</h1>

      <div className='flex flex-col md:flex-row gap-8'>
        <Chores householdName={name!} id={id!} />
        <Residents householdName={name!} id={id!} />
        <Groceries householdName={name!} id={id!} />
        <CostSplitter />
      </div>
    </>
  );
}
