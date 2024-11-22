'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import {
  addToField,
  deleteFromField,
} from '@/lib/firebase/firebaseInteractions';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { HouseholdList } from '../household-list/household-list';
import { HouseholdListItem } from '../household-list/household-list-item';
import { AddNewItem } from '../household-list/add-new-item';

interface MembersProps {
  householdName: string;
  id: string;
}

export const Residents: React.FC<MembersProps> = ({ householdName, id }) => {
  const [residents, setResidents] = useState<string[]>([]);
  const [newResident, setNewResident] = useState<string | null>(null);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);

  useEffect(() => {
    if (!householdName || !id) return;

    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setResidents(data.residents);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  const addNewResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResident) return;

    addToField(id, 'residents', newResident);
    setNewResident(null);
  };

  const residentSelection = (resident: string) => {
    setSelectedResidents((prev) =>
      prev.includes(resident)
        ? prev.filter((r) => r !== resident)
        : [...prev, resident]
    );
  };

  const removeSelectedResidents = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResidents.length) return;

    selectedResidents.forEach(
      async (resident) => await deleteFromField(id, 'residents', resident)
    );
    setSelectedResidents([]);
  };

  return (
    <div className='text-center bg-white p-4 rounded-md'>
      <h2 className='text-center'>residents</h2>

      <AddNewItem
        addNewItemFunction={addNewResident}
        newItem={newResident}
        setNewItemFunction={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewResident(e.target.value)
        }
        placeHolderText='Add a new resident'
      />

      <form onSubmit={removeSelectedResidents}>
        <HouseholdList>
          {residents.map((resident) => (
            <HouseholdListItem
              key={resident}
              item={resident}
              onItemSelect={residentSelection}
              selectedItems={selectedResidents}
            />
          ))}
        </HouseholdList>

        {selectedResidents.length >= 1 && (
          <button className='bg-orange-200 p-1 rounded-md' type='submit'>
            Remove selected
          </button>
        )}
      </form>
    </div>
  );
};
