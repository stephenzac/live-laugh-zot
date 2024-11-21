'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  addToField,
  deleteFromField,
} from '@/lib/firebase/firebaseInteractions';

interface ChoresProps {
  householdName: string;
  id: string;
}

export const Chores: React.FC<ChoresProps> = ({ householdName, id }) => {
  const [chores, setChores] = useState<string[]>([]);
  const [newChore, setNewChore] = useState<string | null>(null);
  const [selectedChores, setSelectedChores] = useState<string[]>([]);

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

    addToField(id, 'chores', newChore);
    setNewChore(null);
  };

  const choreSelection = (chore: string) => {
    setSelectedChores((prev) =>
      prev.includes(chore) ? prev.filter((c) => c !== chore) : [...prev, chore]
    );
  };

  const removeSelectedChores = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChores.length) return;

    selectedChores.forEach(async (chore) => {
      await deleteFromField(id, 'chores', chore);
    });
    setSelectedChores([]);
  };

  return (
    <div className='bg-white p-4 rounded-md'>
      <h2 className='text-center'>chores</h2>

      <form onSubmit={addChore} className='mb-4'>
        <input
          className='text-center rounded-md border-2 border-slate-300'
          type='text'
          onChange={(e) => setNewChore(e.target.value)}
          placeholder='Add a chore...'
          value={newChore || ''}
        />
      </form>

      <form onSubmit={removeSelectedChores}>
        <ul className='flex flex-col items-start pl-4'>
          {chores.map((chore) => (
            <li key={chore}>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  onChange={() => choreSelection(chore)}
                  checked={selectedChores.includes(chore)}
                  className='accent-green-500'
                />
                {chore}
              </div>
            </li>
          ))}
        </ul>

        <button className='' type='submit'>
          Remove selected
        </button>
      </form>
    </div>
  );
};
