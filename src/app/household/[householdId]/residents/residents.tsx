'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import {
  addToField,
  deleteFromField,
} from '@/lib/firebase/firebaseInteractions';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

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

      <form onSubmit={addNewResident} className='mb-4'>
        <input
          className='text-center rounded-md border-2 border-slate-300'
          type='text'
          onChange={(e) => setNewResident(e.target.value)}
          placeholder='Add a new roommate...'
          value={newResident || ''}
        />
      </form>

      <form onSubmit={removeSelectedResidents}>
        <ul className='flex flex-col items-start pl-4 mb-4'>
          {residents.map((resident) => (
            <li key={resident}>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  onChange={() => residentSelection(resident)}
                  checked={selectedResidents.includes(resident)}
                  className='accent-green-500'
                />
                {resident}
              </div>
            </li>
          ))}
        </ul>

        {selectedResidents.length >= 1 && (
          <button className='bg-orange-200 p-1 rounded-md' type='submit'>
            Remove selected
          </button>
        )}
      </form>
    </div>
  );
};
