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
import { RemoveButton } from '../household-list/remove-button';

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
        setGroceries(data.groceries || []);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  const addNewGroceryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrocery) return;

    addToField(id, 'groceries', newGrocery);
    setNewGrocery('');
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
    <div className='bg-white rounded-md p-4 max-w-4xl mx-auto shadow-md'>
      <h2 className='font-extrabold text-lg text-center mb-4'>🛒 Groceries</h2>

      <div className='bg-gray-50 rounded-md p-4'>
        <AddNewItem
          addNewItemFunction={addNewGroceryItem}
          newItem={newGrocery}
          setNewItemFunction={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewGrocery(e.target.value)
          }
          placeHolderText='Add new item'
        />

        <form onSubmit={removeSelectedGroceries} className='mt-4'>
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
            <div className='mt-4 flex justify-start'>
              <RemoveButton />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
