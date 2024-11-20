import { LoginForm } from '@/app/household/components/login-form';

export default function Home() {
  return (
    <>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold'>live, laugh, zot</h1>
      </header>

      <p className='text-xl mb-3'>Log into your household:</p>

      <LoginForm />
    </>
  );
}
