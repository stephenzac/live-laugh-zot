import { db } from './firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

const ID_MAX: number = 100000000000;

export interface Note {
  id: number;
  poster: string;
  timestamp: string;
  content: string;
}

export const getNotes = async (
  householdId: string
): Promise<Note[] | undefined> => {
  const houseRef = doc(collection(db, 'households'), householdId);
  const houseSnap = await getDoc(houseRef);

  if (houseSnap.exists()) return houseSnap.data()['notes'];

  console.error('Household does not exist :(');
};

export const addNote = async (
  householdId: string,
  poster: string,
  content: string
) => {
  if (!householdId) console.error('No household ID has been provided.');

  if (!poster) console.error('Who is authoring this note?');

  if (!content) console.error('Please write a note');

  try {
    const id: number = Math.floor(Math.random() * ID_MAX);
    const present = new Date();

    const date = present.toLocaleDateString();
    const time = present.toLocaleTimeString();

    const timestamp = `${date}, ${time}`;

    const note: Note = {
      id: id,
      poster: poster,
      timestamp: timestamp,
      content: content,
    };

    const houseRef = doc(collection(db, 'households'), householdId);

    await updateDoc(houseRef, { notes: arrayUnion(note) });
  } catch (error) {
    console.error('There was an error adding the note', error);
  }
};

export const removeNote = async (householdId: string, id: number) => {
  if (!id) {
    console.error('No Id was given.');
  }

  try {
    const houseRef = doc(collection(db, 'households'), householdId);
    const houseSnap = await getDoc(houseRef);

    if (houseSnap.exists()) {
      const notes = houseSnap.data().notes || [];
      const toRemove = notes.find((note: any) => note.id === id);

      if (!toRemove) return;

      await updateDoc(houseRef, { notes: arrayRemove(toRemove) });
    }
  } catch (error) {
    console.error('There was an error removing the note', error);
  }
};
