import Link from 'next/link';

export const Footer: React.FC = () => (
  <div className='w-full h-24 flex flex-col justify-center items-center bg-orange-200'>
    <h1 className='text-4xl text-gray-600 italic mb-3'>live, laugh, zot</h1>
    <Link href='/about'>
      <span className='italic'>About Us</span>
    </Link>
  </div>
);
