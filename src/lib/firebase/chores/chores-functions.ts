import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export const deleteFromField = async (
  householdID: string,
  fieldName: string,
  memberName: string
) => {
  const docRef = doc(db, "households", householdID);

  try {
    if (fieldName == "chores")
      await updateDoc(docRef, { chores: arrayRemove(memberName) });
    else if (fieldName == "groceries")
      await updateDoc(docRef, { groceries: arrayRemove(memberName) });
    else if (fieldName == "residents")
      await updateDoc(docRef, { residents: arrayRemove(memberName) });
  } catch (error) {
    console.error("Failed to delete chore.", error);
  }
};

// export const addToField = async (householdID: string, choreName: string) => {};
