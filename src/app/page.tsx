import { LoginForm } from '@/app/household/components/login-form';
import { CreateHouseholdForm } from './household/components/create-household-form';

export default function Home() {
  return (
    <>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold'>live, laugh, zot</h1>
      </header>

      <h2 className='text-xl mb-3'>Log into your Household</h2>
      <LoginForm />

      <h2 className='text-xl mb-3'>Or, create a new Household</h2>
      <CreateHouseholdForm />
    </>
  );
}
