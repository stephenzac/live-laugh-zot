'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface GroceriesProps {
  householdName: string;
  id: string;
}

export const Groceries: React.FC<GroceriesProps> = ({ householdName, id }) => {
  const [groceries, setGroceries] = useState<string[]>([]);
  const [newGrocery, setNewGrocery] = useState<string | null>(null);

  useEffect(() => {
    if (!householdName || !id) return;

    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setGroceries(data.groceries);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  const addNewGroceryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrocery) return;

    console.log('adding ', newGrocery);
    // call add chore function here

    setNewGrocery(null);
  };

  return (
    <div className='bg-white p-4'>
      <h2 className='text-center'>grocery list for {householdName}</h2>

      <form onSubmit={addNewGroceryItem} className='mb-4'>
        <input
          className='text-center rounded-md border-2 border-slate-300'
          type='text'
          onChange={(e) => setNewGrocery(e.target.value)}
          placeholder='Add a new item...'
          value={newGrocery || ''}
        />
      </form>

      <ul className='flex flex-col items-center'>
        {groceries.map((grocery) => (
          <li key={grocery}>{grocery}</li>
        ))}
      </ul>
    </div>
  );
};
