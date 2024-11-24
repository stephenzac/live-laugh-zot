import { db } from '@/lib/firebase/firebaseConfig';
import { addCost, Cost, Transaction } from '@/lib/firebase/treasuryFunctions';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface TreasuryProps {
  householdName: string;
  id: string;
}

export const Treasury: React.FC<TreasuryProps> = ({ householdName, id }) => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [newCost, setNewCost] = useState({
    title: '',
    category: '',
    amount: '',
    payer: '',
  });

  const [newTransaction, setNewTransaction] = useState({
    payer: '',
    paidTo: '',
    amount: '',
  });

  useEffect(() => {
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

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCost = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, category, amount, payer } = newCost;

    if (!title || !category || !amount || !payer) {
      alert('Please fill all the fields');
      return;
    }

    await addCost(id, title, category, parseFloat(amount), payer);

    setNewCost({
      title: '',
      category: '',
      amount: '',
      payer: '',
    });
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const { payer, paidTo, amount } = newTransaction;

    if (!payer || !paidTo || !amount) {
      alert('Please fill all the fields');
      return;
    }

    // await addTrans(id, payer, paidTo, ...);

    setNewTransaction({
      payer: '',
      paidTo: '',
      amount: '',
    });
  };

  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-3xl bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-xl font-bold text-gray-800 text-center'>
          💰 Cost Splitter
        </h1>

        <div className='grid gap-6 mt-6 sm:grid-cols-1 lg:grid-cols-2'>
          <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700'>Need to Pay</h2>
            <ul className='mt-3 space-y-2 max-h-64 overflow-y-scroll'>
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
          <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700'>
              Add a New Cost
            </h2>
            <form className='flex flex-col gap-4 mt-3' onSubmit={handleAddCost}>
              <input
                type='text'
                name='title'
                placeholder="Title (e.g., Dinner at Joe's)"
                className='border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={newCost.title}
                onChange={handleCostChange}
              />
              <input
                type='text'
                name='category'
                placeholder='Category (e.g., Food)'
                className='border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={newCost.category}
                onChange={handleCostChange}
              />
              <input
                type='number'
                name='amount'
                placeholder='Amount (e.g., 25.00)'
                className='border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={newCost.amount}
                onChange={handleCostChange}
              />
              <input
                type='text'
                name='payer'
                placeholder='Payer (e.g., John)'
                className='border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={newCost.payer}
                onChange={handleCostChange}
              />
              <button
                type='submit'
                className='bg-orange-200 text-white font-bold p-1 rounded-md w-full'
              >
                Add Cost
              </button>
            </form>
          </div>

          <div className='p-4 bg-gray-50 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700'>
              Create a Transaction
            </h2>
            <form
              className='flex flex-col gap-4 mt-3'
              onSubmit={handleAddTransaction}
            >
              <input
                type='text'
                name='payer'
                placeholder='Payer (e.g., John)'
                className='border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500'
                value={newTransaction.payer}
                onChange={handleTransactionChange}
              />
              <input
                type='text'
                name='paidTo'
                placeholder='Paid To (e.g., Jane)'
                className='border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500'
                value={newTransaction.paidTo}
                onChange={handleTransactionChange}
              />
              <input
                type='number'
                name='amount'
                placeholder='Amount (e.g., 15.00)'
                className='border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500'
                value={newTransaction.amount}
                onChange={handleTransactionChange}
              />
              <button
                type='submit'
                className='bg-orange-200 text-white font-bold p-1 rounded-md w-full'
              >
                Record Transaction
              </button>
            </form>
          </div>
        </div>

        <div className='p-4 bg-gray-50 rounded-lg shadow-sm mt-6'>
          <h2 className='text-lg font-semibold text-gray-700'>
            Outstanding Balances
          </h2>
          <ul className='mt-3 space-y-2'></ul>
        </div>
      </div>
    </div>
  );
};
