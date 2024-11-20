'use server';

import { db } from '@/lib/firebase/firebaseConfig';
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export const attempLogin = async (
  householdName: string,
  passwordHash: string
) => {
  const householdsRef = collection(db, 'households');
  const q = query(householdsRef, where('name', '==', householdName));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { success: false, message: 'Household does not exist.' };
  }

  const householdData = querySnapshot.docs[0].data();

  return householdData.passwordHash === passwordHash
    ? {
        success: true,
        message: 'Login successful.',
        householdId: querySnapshot.docs[0].data().id,
      }
    : { success: false, message: 'Incorrect password.' };
};

export const createHousehold = async (
  householdName: string,
  passwordHash: string
) => {
  const householdsRef = collection(db, 'households');

  // TODO: Get household ID from name here
  // const householdId = ...

  const newHousehold = {
    name: householdName,
    id: 'test-id-2',
    // id: householdId,
    passwordHash,
    members: [],
    chores: [],
    groceries: [],
  };

  const docRef = await addDoc(householdsRef, newHousehold);
  console.log('household created with ID: ', docRef.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) console.log(docSnap.data().id);
  else {
    return {
      success: false,
      message: 'Household creation unsuccessful. Please try again.',
    };
  }

  return {
    success: true,
    message: 'Household creation successful.',
    householdId: docSnap.data().id,
  };
};
