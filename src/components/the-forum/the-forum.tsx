import { db } from '@/lib/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { HouseholdList } from '../household-list/household-list';
import { addNote, Note, removeNote } from '@/lib/firebase/noteboardFunctions';

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
    if (!householdName || !id) return;

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
    <div className='bg-white rounded-md p-4'>
      <h2 className='text-center'>the forum</h2>

      <div className='text-center bg-white rounded-md'>
        <form onSubmit={addNewNote} className='flex flex-col gap-2 mb-4'>
          <input
            className='text-center rounded-md border-2 border-slate-300'
            type='text'
            placeholder='Name'
            onChange={(e) => setNewNotePoster(e.target.value)}
            value={newNotePoster || ''}
          />

          <input
            className='text-center rounded-md border-2 border-slate-300'
            type='text'
            placeholder='Write your message'
            onChange={(e) => setNewNoteContent(e.target.value)}
            value={newNoteContent || ''}
          />

          <button className='bg-orange-200 p-1 rounded-md' type='submit'>
            Add message
          </button>
        </form>

        <form onSubmit={removeSelectedNotes}>
          <HouseholdList>
            {notes.map((note) => (
              <li key={note.id}>
                <div className='flex flex-col items-start'>
                  <input
                    type='checkbox'
                    onChange={() => noteSelection(note.id)}
                    checked={selectedNotes.includes(note.id)}
                    className='accent-green-500'
                  />
                  <p className='font-bold'>{note.poster}</p>
                  <p className='text-gray-400 text-sm'>{note.timestamp}</p>
                  <p>{note.content}</p>
                </div>
              </li>
            ))}
          </HouseholdList>

          {selectedNotes.length >= 1 && (
            <button className='bg-orange-200 p-1 rounded-md' type='submit'>
              Remove selected
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
