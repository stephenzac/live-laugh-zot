import Link from 'next/link';

export const Footer: React.FC = () => (
  <div className='w-full h-24 flex flex-col justify-center items-center bg-orange-10'>
    <h1 className='text-2xl text-grey-600 italic mb-3'>Live, Laugh, Zot</h1>
    <Link href='/about'>
      <span className='italic'>About Us</span>
    </Link>
  </div>
);
