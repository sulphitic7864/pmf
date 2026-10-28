import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../server/api_endpoints';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(Number(value || 0));

const formatRate = (rate) => `$${Number(rate || 0).toFixed(2)} per view`;

const TransactionContent = () => {
  const [summary, setSummary] = useState({ lifetimeViews: 0, lifetimeEarnings: 0, monthlySummary: [] });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        setError('Please log in to view your transaction history.');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [summaryRes, transactionsRes] = await Promise.all([
          fetch(API_ENDPOINTS.GET_USER_VIEW_SUMMARY, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(API_ENDPOINTS.GET_USER_VIEW_TRANSACTIONS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const summaryData = await summaryRes.json();
        const transactionsData = await transactionsRes.json();

        if (!summaryRes.ok || !summaryData?.status) {
          throw new Error(summaryData?.message || 'Unable to load the summary.');
        }

        if (!transactionsRes.ok || !transactionsData?.status) {
          throw new Error(transactionsData?.message || 'Unable to load the transactions.');
        }

        if (!isMounted) return;

        setSummary(summaryData.result || { lifetimeViews: 0, lifetimeEarnings: 0, monthlySummary: [] });
        setTransactions(transactionsData.result || []);
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Unable to load transactions.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#0b1115] p-4 text-gray-300">
        <p className="text-center py-8">Please log in to view your transaction history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#0b1115] p-4 text-gray-300">
        <p className="text-center py-8">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#0b1115] p-4 text-gray-300">
        <p className="text-center py-8 text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 rounded-xl border border-white/10 bg-[#0b1115] p-4 text-gray-200 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 rounded-xl border border-white/10 bg-[#0d1418] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Lifetime views</p>
          <p className="mt-3 text-3xl font-bold text-white">{Number(summary.lifetimeViews || 0).toLocaleString()}</p>
        </div>
        <div className="flex-1 rounded-xl border border-white/10 bg-[#0d1418] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Lifetime earnings</p>
          <p className="mt-3 text-3xl font-bold text-white">{formatCurrency(summary.lifetimeEarnings || 0)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0d1418] p-4">
        <h3 className="mb-4 text-lg font-semibold text-white">Monthly summary</h3>
        {summary.monthlySummary?.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {summary.monthlySummary.map((entry) => (
              <div key={entry.month} className="rounded-lg border border-white/10 bg-[#101a1d] p-4">
                <p className="text-sm font-semibold text-cyan-300">{entry.month}</p>
                <div className="mt-3 space-y-1 text-sm text-gray-300">
                  <p>Views: {Number(entry.views || 0).toLocaleString()}</p>
                  <p>Rate: {formatRate(entry.rate || 0)}</p>
                  <p>Earnings: {formatCurrency(entry.earnings || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No view transactions have been recorded yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0d1418] p-4 overflow-hidden">
        <h3 className="mb-4 text-lg font-semibold text-white">Recent transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-gray-200">
            <thead className="bg-white/[0.02] text-gray-300">
              <tr>
                <th className="border-b border-white/10 px-3 py-3 font-medium">Views</th>
                <th className="border-b border-white/10 px-3 py-3 font-medium">Rate</th>
                <th className="border-b border-white/10 px-3 py-3 font-medium">Earned</th>
                <th className="border-b border-white/10 px-3 py-3 font-medium">Date & time</th>
                {/* <th className="border-b border-white/10 px-3 py-3 font-medium">Month</th> */}
              </tr>
            </thead>
            <tbody>
              {transactions.length ? transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id} className="odd:bg-white/[0.01]">
                  <td className="border-b border-white/10 px-3 py-3">{Number(transaction.viewsAdded || 0).toLocaleString()}</td>
                  <td className="border-b border-white/10 px-3 py-3">{formatRate(transaction.ratePerView || 0)}</td>
                  <td className="border-b border-white/10 px-3 py-3 font-medium text-cyan-200">{formatCurrency(transaction.earnings || 0)}</td>
                  <td className="border-b border-white/10 px-3 py-3">{new Date(transaction.transactionDate).toLocaleString()}</td>
                  {/* <td className="border-b border-white/10 px-3 py-3">{transaction.month || '?'}</td> */}
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-gray-400">No transactions yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionContent;
