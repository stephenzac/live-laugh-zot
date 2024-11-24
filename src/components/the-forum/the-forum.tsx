import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { HouseholdList } from '../household-list/household-list';
import { addNote, Note, removeNote } from '@/lib/firebase/noteboardFunctions';
import { RemoveButton } from '../household-list/remove-button';

interface TheForumProps {
  householdName: string;
  id: string;
}

export const TheForum: React.FC<TheForumProps> = ({ householdName, id }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [newNotePoster, setNewNotePoster] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState<string | null>(null);

  useEffect(() => {
    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setNotes(data.notes);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  const addNewNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNotePoster || !newNoteContent) return;

    addNote(id, newNotePoster, newNoteContent);
    setNewNotePoster('');
    setNewNoteContent('');
  };

  const noteSelection = (noteId: number) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((c) => c !== noteId)
        : [...prev, noteId]
    );
  };

  const removeSelectedNotes = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNotes.length) return;

    selectedNotes.forEach(async (noteId) => {
      await removeNote(id, noteId);
    });
    setSelectedNotes([]);
  };

  return (
    <div className='bg-white rounded-md p-4 max-w-4xl mx-auto shadow-md'>
      <h2 className='font-extrabold text-lg text-center mb-4'>📨 The Forum</h2>

      <div className='bg-gray-50 rounded-md p-4'>
        <form onSubmit={addNewNote} className='flex flex-col gap-4 mb-6'>
          <input
            className='text-center rounded-md border-2 border-slate-300 p-2 w-full'
            type='text'
            placeholder='Name'
            onChange={(e) => setNewNotePoster(e.target.value)}
            value={newNotePoster || ''}
          />

          <textarea
            className='text-center rounded-md border-2 border-slate-300 p-2 w-full resize-none'
            placeholder='Write your message'
            onChange={(e) => setNewNoteContent(e.target.value)}
            value={newNoteContent || ''}
          />

          <button
            className='bg-orange-200 text-white font-bold p-2 rounded-md w-full'
            type='submit'
          >
            Add Message
          </button>
        </form>

        <form onSubmit={removeSelectedNotes}>
          <HouseholdList>
            {notes.map((note) => (
              <li
                key={note.id}
                className='flex flex-col md:flex-row items-start md:items-center gap-3 p-3 bg-white border rounded-md shadow-sm'
              >
                <input
                  type='checkbox'
                  onChange={() => noteSelection(note.id)}
                  checked={selectedNotes.includes(note.id)}
                  className='accent-green-500'
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{note.poster}</p>
                  <p className='text-gray-400 text-sm'>{note.timestamp}</p>
                  <p>{note.content}</p>
                </div>
              </li>
            ))}
          </HouseholdList>

          {selectedNotes.length >= 1 && (
            <div className='mt-4 flex justify-start'>
              <div className='w-full flex justify-start'>
                <RemoveButton />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
