import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { jwtDecode } from 'jwt-decode';

const PaymentContent = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token === null) return;
    try {
      const decoded = jwtDecode(token);
      setUserID(decoded.UserId);
    } catch {
      setError("Invalid token");
    }
  }, [token]);

  useEffect(() => {
    if (!userID) return;

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(
          API_ENDPOINTS.GET_PAYMENT_DETAILS_BY_USER(userID),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();

        if (data.success) {
          // Remove duplicates by keeping only the first occurrence of each pay_id
          const uniquePayments = data.result.reduce((acc, current) => {
            const payIdExists = acc.find(
              item => item.payments.pay_id === current.payments.pay_id
            );
            if (!payIdExists) {
              acc.push(current);
            }
            return acc;
          }, []);
          
          setPaymentData(uniquePayments);
        } else {
          setError("Failed to fetch payment data");
        }
      } catch {
        setError("Error fetching payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [userID]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toLowerCase(),
    }).format(amount);
  };

  if (!token) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="rounded-lg">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400">
              Please login to view payment history
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="rounded-lg">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400">Loading payment history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="rounded-lg">
          <div className="flex justify-center items-center h-40">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
      <div className="rounded-lg">
        <div className="border-b border-gray-800 p-4">
          <h2 className="text-xl font-semibold text-white">Payment History</h2>
        </div>
        <div className="p-4">
          {paymentData.length > 0 ? (
            <div className="space-y-4">
              {paymentData.map((payment) => (
                <div
                  key={payment.payments.pay_id}
                  className="border border-gray-800 rounded-lg p-4 bg-gray-800 shadow-sm hover:bg-gray-750"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Payment ID</p>
                      <p className="font-medium text-gray-200">
                        {payment.payments.pay_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="font-medium text-gray-200">
                        {formatCurrency(
                          payment.payments.amount,
                          payment.payments.currency
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="font-medium text-gray-200">
                        {payment.user.firstName} {payment.user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium text-gray-200">
                        {payment.user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="font-medium text-gray-200">
                        {formatDate(payment.payments.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.payments.status === "succeeded"
                            ? "bg-green-900 text-green-200"
                            : "bg-yellow-900 text-yellow-200"
                        }`}
                      >
                        {payment.payments.status.charAt(0).toUpperCase() +
                          payment.payments.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">
              No payment history available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentContent;
