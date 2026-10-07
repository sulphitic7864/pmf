import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../server/api_endpoints';

const PaymentContent = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_USER_PAYMENT_HISTORY, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.result)) {
          throw new Error(data.message || 'Failed to fetch payment history.');
        }
        setPaymentData(data.result);
      } catch (fetchError) {
        setError(fetchError.message || 'Error fetching payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [token]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatCurrency = (amount, currency) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toLowerCase(),
  }).format(Number(amount) / 100);

  if (!token || loading || error) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="flex h-40 items-center justify-center">
          <p className={error ? 'text-red-400' : 'text-gray-400'}>
            {!token
              ? 'Please log in to view payment history.'
              : loading
                ? 'Loading payment history...'
                : error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-xl font-semibold text-white">Payment History</h2>
      </div>
      <div className="p-4">
        {paymentData.length > 0 ? (
          <div className="space-y-4">
            {paymentData.map((payment) => (
              <div
                key={payment.pay_id}
                className="rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm hover:bg-gray-750"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-400">Payment ID</p>
                    <p className="font-medium text-gray-200">{payment.pay_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="font-medium text-gray-200">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="font-medium text-gray-200">{payment.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-medium text-gray-200">{formatDate(payment.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        payment.status === 'succeeded'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-yellow-900 text-yellow-200'
                      }`}
                    >
                      {payment.status
                        ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-400">No payment history available.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentContent;
