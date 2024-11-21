'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface ChoresProps {
  householdName: string;
  id: string;
}

export const Chores: React.FC<ChoresProps> = ({ householdName, id }) => {
  const [chores, setChores] = useState<string[]>([]);
  const [newChore, setNewChore] = useState<string | null>(null);

  useEffect(() => {
    if (!householdName || !id) return;

    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setChores(data.chores);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  const addChore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChore) return;

    console.log('adding, ', newChore);
    // call add chore function here

    setNewChore(null);
  };

  return (
    <div className='bg-white p-4'>
      <h2 className='text-center'>chores for {householdName}</h2>

      <form onSubmit={addChore} className='mb-4'>
        <input
          className='text-center rounded-md border-2 border-slate-300'
          type='text'
          onChange={(e) => setNewChore(e.target.value)}
          placeholder='Add a chore...'
          value={newChore || ''}
        />
      </form>

      <ul className='flex flex-col items-center'>
        {chores.map((chore) => (
          <li key={chore}>{chore}</li>
        ))}
      </ul>
    </div>
  );
};
