'use client';

import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface MembersProps {
  householdName: string;
  id: string;
}

export const Members: React.FC<MembersProps> = ({ householdName, id }) => {
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<string | null>(null);

  useEffect(() => {
    if (!householdName || !id) return;

    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setMembers(data.members);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  const addNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember) return;

    // call add new member function here
    console.log('adding, ', newMember);

    setNewMember(null);
  };

  return (
    <div className='bg-white p-4'>
      <h2 className='text-center'>members of {householdName}</h2>

      <form onSubmit={addNewMember} className='mb-4'>
        <input
          className='text-center rounded-md border-2 border-slate-300'
          type='text'
          onChange={(e) => setNewMember(e.target.value)}
          placeholder='Add a new roommate...'
          value={newMember || ''}
        />
      </form>

      <ul className='flex flex-col items-center'>
        {members.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
};
