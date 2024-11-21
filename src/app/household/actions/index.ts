'use server';

import { db } from '@/lib/firebase/firebaseConfig';
import { titleCase } from '@/lib/firebase/string';
import { compareSync } from 'bcryptjs';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

export const attempLogin = async (householdName: string, password: string) => {
  const householdsRef = collection(db, 'households');
  const q = query(householdsRef, where('name', '==', householdName));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { success: false, message: 'Household does not exist.' };
  }

  const householdData = querySnapshot.docs[0].data();
  const passwordIsValid = compareSync(password, householdData.passwordHash);

  return passwordIsValid
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
  // Check if household with name already exists
  const householdsRef = collection(db, 'households');
  const q = query(householdsRef, where('name', '==', householdName));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return {
      success: false,
      message:
        'Household already exists. Please use a different household name.',
    };
  }

  // Add new household to Firestore
  const newHouseholdId = titleCase(householdName);
  const newHouseholdRef = doc(db, 'households', newHouseholdId);

  const newHousehold = {
    name: householdName,
    id: newHouseholdId,
    passwordHash,
    members: [],
    chores: [],
    groceries: [],
  };

  try {
    await setDoc(newHouseholdRef, newHousehold);
    console.log('Household created with ID: ', newHouseholdRef.id);

    return {
      success: true,
      message: 'Household created successfully.',
      householdId: newHouseholdRef.id,
    };
  } catch (err) {
    return err instanceof Error
      ? { success: false, message: err.message }
      : {
          success: false,
          message: 'An unknown error occured, please try again.',
        };
  }
};
