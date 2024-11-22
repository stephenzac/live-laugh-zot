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

      <AddNewItem
        addNewItemFunction={addNewGroceryItem}
        newItem={newGrocery}
        setNewItemFunction={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewGrocery(e.target.value)
        }
        placeHolderText='Add new item'
      />

      <form onSubmit={removeSelectedGroceries}>
        <HouseholdList>
          {groceries.map((grocery) => (
            <HouseholdListItem
              key={grocery}
              item={grocery}
              onItemSelect={grocerySelection}
              selectedItems={selectedGroceries}
            />
          ))}
        </HouseholdList>

        {selectedGroceries.length >= 1 && (
          <button className='bg-orange-200 p-1 rounded-md' type='submit'>
            Remove selected
          </button>
        )}
      </form>
    </div>
  );
};
