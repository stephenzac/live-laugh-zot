'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  addToField,
  deleteFromField,
} from '@/lib/firebase/firebaseInteractions';
import { HouseholdList } from '../household-list/household-list';
import { HouseholdListItem } from '../household-list/household-list-item';
import { AddNewItem } from '../household-list/add-new-item';

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
    <div className='text-center bg-white p-4 rounded-md'>
      <h2 className='text-center'>chores</h2>

      <AddNewItem
        addNewItemFunction={addChore}
        newItem={newChore}
        setNewItemFunction={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewChore(e.target.value)
        }
        placeHolderText='Add new chore'
      />

      <form onSubmit={removeSelectedChores}>
        <HouseholdList>
          {chores.map((chore) => (
            <HouseholdListItem
              key={chore}
              item={chore}
              onItemSelect={choreSelection}
              selectedItems={selectedChores}
            />
          ))}
        </HouseholdList>

        {selectedChores.length >= 1 && (
          <button className='bg-orange-200 p-1 rounded-md' type='submit'>
            Remove selected
          </button>
        )}
      </form>
    </div>
  );
};
