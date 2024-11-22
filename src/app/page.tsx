import { LoginForm } from '@/components/login-form';
import { CreateHouseholdForm } from '../components/create-household-form';
import { Fascinate_Inline } from 'next/font/google';

const fascinate = Fascinate_Inline({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fascinate',
  weight: ['400'],
});

export default function Home() {
  return (
    <>
      <header className='mb-10'>
        <h1 className={`${fascinate.className} text-3xl md:text-5xl mb-5`}>
          Live, Laugh, Zot 🌞
        </h1>
        <h2 className='w-full text-center text-xl mb-5 italic'>
          The perfect tool for Anteater households!
        </h2>
      </header>

      <div className='flex flex-col gap-8 sm:flex-row sm:gap-8 md:gap-16'>
        <div className='flex flex-col bg-white rounded-md p-6 sm:p-8 md:p-12 max-w-xl w-full mx-auto shadow-md'>
          <h2 className='text-2xl font-bold mb-3 text-center sm:text-left'>
            Log in to Household
          </h2>
          <LoginForm />
        </div>

        <div className='flex flex-col bg-white rounded-md p-6 sm:p-8 md:p-12 max-w-xl w-full mx-auto shadow-md'>
          <h2 className='text-2xl font-bold mb-3 text-center sm:text-left'>
            Create New Household
          </h2>
          <CreateHouseholdForm />
        </div>
      </div>
    </>
  );
}
