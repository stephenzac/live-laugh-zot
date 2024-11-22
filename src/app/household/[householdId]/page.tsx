'use client';

import { useHouseholdStore } from '@/lib/zustand/store';
import { redirect } from 'next/navigation';
import { Chores } from '@/components/chores/chores';
import { Residents } from '@/components/residents/residents';
import { Groceries } from '@/components/groceries/groceries';
import { Treasury } from '@/components/treasury/treasury';
import { ConflictResolver } from '@/components/conflict-resolver/conflict-resolver';
import { TheForum } from '@/components/the-forum/the-forum';

import { Goblin_One } from 'next/font/google';

const goblin = Goblin_One({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-goblin',
  weight: ['400']
});

export default function HouseholdPage() {
  const { name, id, authenticated } = useHouseholdStore();

  if (!authenticated) redirect('/');

  return (
    <div className='w-full text-center gap-8'>
      <h1 className={`${goblin.className} text-[50px] mb-20`}>Welcome to {name}!</h1>

      <div className='flex flex-col md:flex-row gap-8'>
        <TheForum householdName={name!} id={id!} />
        <ConflictResolver householdName={name!} id={id!} />
        <Chores householdName={name!} id={id!} />
        <Residents householdName={name!} id={id!} />
        <Groceries householdName={name!} id={id!} />
      </div>
      <Treasury householdName={name!} id={id!} />
    </div>
  );
}
