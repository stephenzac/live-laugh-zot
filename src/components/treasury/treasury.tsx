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
        setTransactions(data.Transactions || []);
      }
    });

    return () => unsubscribe();
  }, [householdName, id]);

  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-3xl bg-white p-6 rounded-lg shadow-md'>
        {/* Header */}
        <h1 className='text-xl font-bold text-gray-800 text-center'>
          💰 Cost Splitter
        </h1>

        <div className='grid gap-6 mt-6 sm:grid-cols-1 lg:grid-cols-2'>
          {/* Costs */}
          <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700'>Need to Pay</h2>
            <ul className='mt-3 space-y-2'>
              {costs.length > 0 ? (
                costs.map((cost, index) => (
                  <li
                    key={index}
                    className='p-3 bg-gray-100 rounded-md shadow-sm text-sm text-gray-800'
                  >
                    <p>
                      <span className='font-bold'>Title:</span> {cost.title}
                    </p>
                    <p>
                      <span className='font-bold'>Category:</span>{' '}
                      {cost.category}
                    </p>
                    <p>
                      <span className='font-bold'>Amount:</span> ${cost.amount}
                    </p>
                    <p>
                      <span className='font-bold'>Paid by:</span> {cost.payer}
                    </p>
                  </li>
                ))
              ) : (
                <p className='text-sm text-gray-500'>No costs added yet.</p>
              )}
            </ul>
          </div>

          {/* Transactions */}
          <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700'>
              Transactions
            </h2>
            <ul className='mt-3 space-y-2'>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <li
                    key={index}
                    className='p-3 bg-gray-100 rounded-md shadow-sm text-sm text-gray-800'
                  >
                    <p>
                      {transaction.payer} paid {transaction.paid} $
                      {transaction.amount}
                    </p>
                  </li>
                ))
              ) : (
                <p className='text-sm text-gray-500'>
                  No transactions recorded.
                </p>
              )}
            </ul>
          </div>
        </div>

        <div className='grid gap-6 mt-6 sm:grid-cols-1 lg:grid-cols-2'>
          {/* Add New Cost */}
          <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700'>
              Add a New Cost
            </h2>
            <form className='flex flex-col gap-4 mt-3'>
              <input
                type='text'
                placeholder="Title (e.g., Dinner at Joe's)"
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='text'
                placeholder='Category (e.g., Food)'
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='number'
                placeholder='Amount (e.g., 25.00)'
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='text'
                placeholder='Payer (e.g., John)'
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                type='submit'
                className='bg-orange-200 text-white font-bold p-2 rounded-md w-full'
              >
                Add Cost
              </button>
            </form>
          </div>

          {/* Create a Transaction */}
          <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700'>
              Create a Transaction
            </h2>
            <form className='flex flex-col gap-4 mt-3'>
              <input
                type='text'
                placeholder='Payer (e.g., John)'
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
              />
              <input
                type='text'
                placeholder='Paid To (e.g., Jane)'
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
              />
              <input
                type='number'
                placeholder='Amount (e.g., 15.00)'
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
              />
              <button
                type='submit'
                className='bg-orange-200 text-white font-bold p-2 rounded-md w-full'
              >
                Record Transaction
              </button>
            </form>
          </div>
        </div>

        {/* Outstanding Balances */}
        <div className='p-4 bg-gray-50 rounded-lg shadow-sm mt-6'>
          <h2 className='text-lg font-semibold text-gray-700'>
            Outstanding Balances
          </h2>
          <ul className='mt-3 space-y-2'>
            {/* Replace with dynamic calculations */}
            <li className='flex justify-between items-center text-sm text-gray-700'>
              <span>John owes Jane</span>
              <span className='font-bold text-red-500'>$15.00</span>
            </li>
            <li className='flex justify-between items-center text-sm text-gray-700'>
              <span>Jane owes Mike</span>
              <span className='font-bold text-red-500'>$10.00</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
