import { LoginForm } from '@/components/login-form';
import { CreateHouseholdForm } from '../components/create-household-form';

import { Fascinate_Inline } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';

const fascinate = Fascinate_Inline({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fascinate',
  weight: ['400']
});

export const geist = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  weight: ['400']
});

export default function Home() {
  return (
    <>
      <header className='w-full text-center mb-8'>
        <h1 className={`${fascinate.className} text-[50px] mb-5`}>Live, Laugh, Zot 🌞</h1>
        <h2 className='text-[25px] mb-5'>The perfect tool for Anteater households!</h2>
      </header>

      <h2 className='text-xl mb-3'>Log into your Household</h2>
      <LoginForm />

      <h2 className='text-xl mb-3'>Or, create a new Household</h2>
      <CreateHouseholdForm />
    </>
  );
}
