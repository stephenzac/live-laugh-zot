'use client';

interface ChoresProps {
  householdName: string;
}

export const Chores: React.FC<ChoresProps> = ({ householdName }) => {
  // fetch chores here
  const chores = ['blah', 'bleh', 'beep'];

  return (
    <div className='flex flex-col bg-white'>
      <h1>chores for {householdName}</h1>
      <ul className='flex flex-col items-center'>
        {chores.map((chore) => (
          <li key={chore}>{chore}</li>
        ))}
      </ul>
    </div>
  );
};
