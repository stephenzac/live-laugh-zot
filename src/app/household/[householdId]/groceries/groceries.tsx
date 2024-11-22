'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  addToField,
  deleteFromField,
} from '@/lib/firebase/firebaseInteractions';

interface GroceriesProps {
  householdName: string;
  id: string;
}

export const Groceries: React.FC<GroceriesProps> = ({ householdName, id }) => {
  const [groceries, setGroceries] = useState<string[]>([]);
  const [newGrocery, setNewGrocery] = useState<string | null>(null);
  const [selectedGroceries, setSelectedGroceries] = useState<string[]>([]);

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

    addToField(id, 'groceries', newGrocery);
    setNewGrocery(null);
  };

  const grocerySelection = (grocery: string) => {
    setSelectedGroceries((prev) =>
      prev.includes(grocery)
        ? prev.filter((g) => g !== grocery)
        : [...prev, grocery]
    );
  };

  const removeSelectedGroceries = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGroceries.length) return;

    selectedGroceries.forEach(async (grocery) => {
      await deleteFromField(id, 'groceries', grocery);
    });
    setSelectedGroceries([]);
  };

  return (
    <div className='text-center bg-white p-4 rounded-md'>
      <h2 className='text-center'>groceries</h2>

      <form onSubmit={addNewGroceryItem} className='mb-4'>
        <input
          className='text-center rounded-md border-2 border-slate-300'
          type='text'
          onChange={(e) => setNewGrocery(e.target.value)}
          placeholder='Add a new item...'
          value={newGrocery || ''}
        />
      </form>

      <form onSubmit={removeSelectedGroceries}>
        <ul className='flex flex-col items-start pl-4 mb-4'>
          {groceries.map((grocery) => (
            <li key={grocery}>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  onChange={() => grocerySelection(grocery)}
                  checked={selectedGroceries.includes(grocery)}
                  className='accent-green-500'
                />
                {grocery}
              </div>
            </li>
          ))}
        </ul>

        {selectedGroceries.length >= 1 && (
          <button className='bg-orange-200 p-1 rounded-md' type='submit'>
            Remove selected
          </button>
        )}
      </form>
    </div>
  );
};
