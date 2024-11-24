import { Goblin_One } from 'next/font/google';

const goblin = Goblin_One({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-goblin',
  weight: ['400'],
});

export default function About() {
  return (
    <>
      <header className='w-full text-center mb-8'>
        <h1 className={`${goblin.className} text-[30px] mb-10`}>About Us</h1>
        <h2 className='text-[25px] mb-5'>
          We designed this tool for Anteaters living together! We aim to make
          the college experience of living together more enjoyable through
          real-time collaboration.
        </h2>
      </header>

      <h2 className='text-[25px] mb-3'>Meet the Team:</h2>
      <h2 className='text-[20px] mb-3'>Lead/Front-End: Stephen Zacarias</h2>
      <h2 className='text-[20px] mb-3'>Back-End: Michelle Lee</h2>
      <h2 className='text-[20px] mb-3'>Back-End: Yoav Feigenbaum</h2>
    </>
  );
}
