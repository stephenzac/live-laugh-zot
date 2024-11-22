'use client';

import { decideResolver } from '@/lib/conflict-resolver/conflict-resolver-functions';
import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface ConflictResolverProps {
  householdName: string;
  id: string;
}

export const ConflictResolver: React.FC<ConflictResolverProps> = ({
  householdName,
  id,
}) => {
  const [problem, setProblem] = useState<string | null>(null);
  const [resolver, setResolver] = useState<string>('AI');
  const [residents, setResidents] = useState<string[]>([]);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!householdName || !id) return;

    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setResidents(data.residents || []);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!problem) {
      setResponseMessage('Please describe the problem.');
      return;
    }

    if (!selectedResidents.length) {
      setResponseMessage('Please select at least one resident involved.');
      return;
    }

    try {
      const response = await decideResolver(
        problem,
        selectedResidents,
        resolver
      );

      setResponseMessage(`Conflict resolved: ${response?.message}`);

      setProblem('');
      setSelectedResidents([]);
      setResolver('AI');
    } catch (error) {
      setResponseMessage(
        'An error occurred while resolving the conflict. Please try again.'
      );
      console.error(error);
    }
  };

  const residentSelection = (resident: string) => {
    setSelectedResidents((prev) =>
      prev.includes(resident)
        ? prev.filter((r) => r !== resident)
        : [...prev, resident]
    );
  };

  return (
    <div className='bg-white rounded-md p-6 max-w-4xl mx-auto shadow-md'>
      <h2 className='font-extrabold text-lg mb-4 text-center'>
        💬 Conflict Resolver
      </h2>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-6 bg-gray-50 rounded-md p-4'
      >
        <div className='flex flex-col'>
          <label htmlFor='problem' className='font-medium'>
            What&apos;s the problem?
          </label>
          <textarea
            id='problem'
            value={problem || ''}
            onChange={(e) => setProblem(e.target.value)}
            placeholder='Describe your problem'
            className='rounded-md border-2 border-slate-300 p-2 focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>

        <div className='flex flex-col'>
          <label className='font-medium'>Who&apos;s involved?</label>
          <div className='grid grid-cols-2 gap-2'>
            {residents.map((resident) => (
              <label key={resident} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  onChange={() => residentSelection(resident)}
                  checked={selectedResidents.includes(resident)}
                  className='accent-green-500'
                />
                <span>{resident}</span>
              </label>
            ))}
          </div>
        </div>

        <div className='flex flex-col'>
          <label htmlFor='resolver' className='font-medium'>
            How do you want to resolve the problem?
          </label>
          <select
            id='resolver'
            value={resolver}
            onChange={(e) => setResolver(e.target.value)}
            className='rounded-md border-2 border-slate-300 p-2 focus:outline-none focus:ring focus:ring-blue-300'
          >
            <option value='AI'>AI Mediator</option>
            <option value='randomizer'>Random Choice</option>
          </select>
        </div>

        <button
          type='submit'
          className='bg-orange-200 text-white font-bold p-2 rounded-md w-full'
        >
          Resolve
        </button>
      </form>

      {responseMessage && (
        <div
          className={`mt-4 text-center text-sm font-medium p-2 rounded-md  flex items-center justify-center max-w-xs mx-auto ${
            responseMessage.startsWith('Conflict resolved:')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
};
