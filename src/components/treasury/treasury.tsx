import { db } from '@/lib/firebase/firebaseConfig';
import { Cost, Trans } from '@/lib/firebase/treasuryFunctions';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface TreasuryProps {
  householdName: string;
  id: string;
}

export const Treasury: React.FC<TreasuryProps> = ({ householdName, id }) => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [transactions, setTransactions] = useState<Trans[]>([]);

  useEffect(() => {
    if (!householdName || !id) return;

    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCosts(data.Costs || []);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  useEffect(() => {
    if (!householdName || !id) return;

    const householdDocRef = doc(db, 'households', id);

    const unsubscribe = onSnapshot(householdDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTransactions(data.Transactions);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  return (
    <div className='flex flex-row bg-white p-4 rounded-md'>
      <h2 className='text-center'>cost splitter</h2>

      <div className='flex flex-col gap-2'>
        <ul>
          {costs.map((cost, index) => (
            <li key={index} className='flex flex-col'>
              <p>Title: {cost.title}</p>
              <p>Category: {cost.category}</p>
              <p>Amount: ${cost.amount}</p>
              <p>Paid by: {cost.payer}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-2'>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index} className='flex flex-col'>
              <p>
                {transaction.payer} paid {transaction.paid} $
                {transaction.amount}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
