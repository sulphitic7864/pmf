import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../server/api_endpoints';

const PaymentContent = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const controller = new AbortController();
    if (!token) {
      setLoading(false);
      return () => controller.abort();
    }

    const fetchPaymentHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINTS.GET_USER_PAYMENT_HISTORY, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            responseText.trimStart().startsWith('<')
              ? 'The payment history endpoint returned a web page instead of API data. Check the configured backend API URL.'
              : 'The payment history endpoint returned an invalid response.',
          );
        }

        if (!response.ok || !data.success || !Array.isArray(data.result)) {
          throw new Error(data.message || data.error || 'Failed to fetch payment history.');
        }
        setPaymentData(data.result);
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(fetchError.message || 'Error fetching payment history.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchPaymentHistory();
    return () => controller.abort();
  }, [token, retryCount]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? 'Date unavailable'
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  const formatCurrency = (amount, currency) => {
    const amountInCents = Number(amount);
    if (!Number.isFinite(amountInCents)) return 'Amount unavailable';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: (currency || 'USD').toUpperCase(),
      }).format(amountInCents / 100);
    } catch {
      return `${(amountInCents / 100).toFixed(2)} ${String(currency || 'USD').toUpperCase()}`;
    }
  };

  if (!token || loading || error) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="flex min-h-40 items-center justify-center">
          <div className="text-center">
            <p className={error ? 'text-red-400' : 'text-gray-400'}>
              {!token
                ? 'Please log in to view payment history.'
                : loading
                  ? 'Loading payment history...'
                  : error}
            </p>
            {error && (
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="mt-3 rounded-md border border-white/15 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/5"
              >
                Try again
              </button>
            )}
          </div>
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
            {paymentData.map((payment, index) => (
              <div
                key={payment.pay_id || `${payment.createdAt}-${index}`}
                className="rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm hover:bg-gray-750"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-400">Payment ID</p>
                    <p className="break-all font-medium text-gray-200">{payment.pay_id || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="font-medium text-gray-200">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="font-medium text-gray-200">{payment.description || 'Payment'}</p>
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
